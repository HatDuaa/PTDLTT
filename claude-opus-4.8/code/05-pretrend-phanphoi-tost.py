import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np, statsmodels.formula.api as smf
from scipy import stats
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].copy()
d['post']=d.dg>=pd.Timestamp('2025-07-01'); d=d.dropna(subset=['ma_hh_ct'])
d['sku']=d.ma_hh_ct.astype('int64').astype(str); d['pg']=d.sotien_sauvat_ct/d.soluong_ct
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index); c8=set(tab[(tab[False]==8)&(tab[True]==8)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10',np.where(d.sku.isin(c8),'C8','X')))
d=d[d.grp!='X']

print("="*70); print("(1) TAN SUAT DOI GIA TRUOC CAN THIEP (kiem tra hanh vi dinh gia co giong nhau)")
pre=d[~d.post]
def chg(x):
    s=x.groupby(x.dg.dt.to_period('W'))['pg'].median().dropna()
    if len(s)<3: return np.nan
    return (s.diff().abs()>1).mean()
f=pre.groupby(['sku','grp']).apply(chg).reset_index(name='freq').dropna()
print(f.groupby('grp')['freq'].agg(['count','mean','median','std']).round(3).to_string())
for a,b_ in [('T','C10'),('T','C8')]:
    x=f[f.grp==a].freq; y=f[f.grp==b_].freq
    print(f"  KS test {a} vs {b_}: D={stats.ks_2samp(x,y).statistic:.3f} p={stats.ks_2samp(x,y).pvalue:.3f}")

print("="*70); print("(2) EVENT STUDY: he so theo THANG, moc chuan = 06/2025 (Y=log gia gom thue)")
base=d.groupby(['sku','grp'])['pg'].median().rename('p0').reset_index()
m=d.copy(); m['thang']=m.dg.dt.to_period('M').astype(str)
mm=m.groupby(['sku','grp','thang'])['pg'].median().reset_index().merge(base,on=['sku','grp'])
mm['y']=np.log(mm.pg/mm.p0)*100
for ctrl in ['C10','C8']:
    s=mm[mm.grp.isin(['T',ctrl])].copy(); s['T']=(s.grp=='T').astype(int)
    r=smf.ols("y ~ C(thang, Treatment('2025-06')) * T",s).fit(cov_type='cluster',cov_kwds={'groups':s.sku})
    print(f"\n  Doi chung {ctrl}:")
    for k,v in r.params.items():
        if k.startswith("C(thang") and ":T" in k:
            lab=k.split('[T.')[1].split(']')[0]
            print(f"    {lab}  beta={v:7.3f}  se={r.bse[k]:6.3f}  p={r.pvalues[k]:.3f}  {'<-- SAU CS' if lab>='2025-07' else '(truoc CS, ky vong ~0)'}")

print("="*70); print("(3) PHAN PHOI Delta log gia (khong chi trung vi)")
w=d.pivot_table(index=['sku','grp'],columns='post',values='pg',aggfunc='median').dropna()
w.columns=['pre','pos']; w=w.reset_index(); w['y']=np.log(w.pos/w.pre)*100
print(w.groupby('grp')['y'].describe(percentiles=[.1,.25,.5,.75,.9]).round(2).to_string())
for a,b_ in [('T','C10'),('T','C8')]:
    x=w[w.grp==a].y; y=w[w.grp==b_].y
    print(f"  KS {a} vs {b_}: D={stats.ks_2samp(x,y).statistic:.3f} p={stats.ks_2samp(x,y).pvalue:.3f} | Mann-Whitney p={stats.mannwhitneyu(x,y).pvalue:.3f}")

print("="*70); print("(4) KIEM DINH TUONG DUONG (TOST) — thay vi ket luan tu p-value lon")
TAU=np.log(1.08/1.10)*100
for ctrl in ['C10','C8']:
    s=w[w.grp.isin(['T',ctrl])].copy(); s['T']=(s.grp=='T').astype(int)
    r=smf.ols('y ~ T',s).fit(cov_type='HC3')
    est,se=r.params['T'],r.bse['T']; lo,hi=est-1.96*se,est+1.96*se
    pt,ptlo,pthi=est/TAU,hi/TAU,lo/TAU
    # TOST voi bien tuong duong = |TAU| (chuyen 100%)
    t1=(est-TAU)/se; t2=(est-0)/se
    p_full=stats.norm.cdf(t1) if TAU<0 else 1-stats.norm.cdf(t1)
    print(f"  [{ctrl}] ATT gia gom thue = {est:+.3f}%  KTC95=[{lo:+.3f},{hi:+.3f}]")
    print(f"        Pass-through = {pt:+.3f}  KTC95=[{ptlo:+.3f},{pthi:+.3f}]")
    print(f"        H0: chuyen HOAN TOAN (={TAU:.3f}%) -> p={2*min(p_full,1-p_full):.4f}  => {'BAC BO chuyen hoan toan' if 2*min(p_full,1-p_full)<0.05 else 'KHONG bac bo'}")
    print(f"        Bien tuong duong +-0.5%: {'DAT (KTC nam gon trong bien)' if lo>-0.5 and hi<0.5 else 'CHUA DAT'}")

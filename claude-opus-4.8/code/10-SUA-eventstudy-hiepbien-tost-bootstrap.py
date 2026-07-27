import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np, statsmodels.formula.api as smf
from scipy import stats
np.random.seed(42)
CUT=pd.Timestamp('2025-07-01'); TAU=np.log(1.08/1.10)*100   # -1.835 diem %

c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].dropna(subset=['ma_hh_ct']).copy()
d['sku']=d.ma_hh_ct.astype('int64').astype(str); d['post']=d.dg>=CUT
d['pg']=d.sotien_sauvat_ct/d.soluong_ct; d['pn']=d.sotien_ct/d.soluong_ct
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index); c8=set(tab[(tab[False]==8)&(tab[True]==8)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10',np.where(d.sku.isin(c8),'C8','X')))
d=d[d.grp!='X']

# ================= SUA LOI 2: hiep bien CHI tu tien can thiep =================
PRE=d[~d.post]
cov=PRE.groupby('sku').agg(type=('type',mode),
      dvt=('ten_dvt_ct',lambda s: s.mode().iloc[0] if s.notna().any() else 'NA'),
      pre_p=('pg','median'), pre_q=('soluong_ct','sum'), pre_w=('dg',lambda s: s.dt.to_period('W').nunique())).reset_index()
w=d.pivot_table(index=['sku','grp'],columns='post',values=['pg','pn'],aggfunc='median').dropna().reset_index()
w.columns=['sku','grp','pg_pre','pg_pos','pn_pre','pn_pos']
w['y']=np.log(w.pg_pos/w.pg_pre)*100; w['yn']=np.log(w.pn_pos/w.pn_pre)*100
w=w.merge(cov,on='sku'); w['lpre']=np.log(w.pre_p); w['lq']=np.log(w.pre_q); w['T']=(w.grp=='T').astype(int)
print("="*72); print("SUA LOI 2 — ATT co hiep bien, hiep bien chi tu TIEN can thiep")
for ctrl in ['C10','C8']:
    s=w[w.grp.isin(['T',ctrl])]
    r0=smf.ols('y ~ T',s).fit(cov_type='HC3')
    r1=smf.ols('y ~ T + C(type) + lpre + lq',s).fit(cov_type='HC3')
    print(f"  [{ctrl}] n={len(s)}  khong hiep bien: {r0.params['T']:+.3f} (se {r0.bse['T']:.3f}, p={r0.pvalues['T']:.3f})"
          f" | CO hiep bien TIEN KY: {r1.params['T']:+.3f} (se {r1.bse['T']:.3f}, p={r1.pvalues['T']:.3f})")

# ================= SUA LOI 1: event study CO SKU FE, chuan hoa dung =================
print("="*72); print("SUA LOI 1 — Event study voi SKU FE + thang FE, Y=log(gia gom thue), chuan 2025-06")
m=d.copy(); m['thang']=m.dg.dt.to_period('M').astype(str)
mm=m.groupby(['sku','grp','thang'])['pg'].median().reset_index(); mm['ly']=np.log(mm.pg)*100
for ctrl in ['C10','C8']:
    s=mm[mm.grp.isin(['T',ctrl])].copy(); s['T']=(s.grp==('T')).astype(int)
    r=smf.ols("ly ~ C(thang, Treatment('2025-06'))*T + C(sku)",s).fit(cov_type='cluster',cov_kwds={'groups':s.sku})
    print(f"  Doi chung {ctrl} (n_obs={len(s)}, n_sku={s.sku.nunique()}):")
    for k in r.params.index:
        if k.startswith("C(thang") and ":T" in k:
            lab=k.split('[T.')[1].split(']')[0]; bb,se=r.params[k],r.bse[k]
            tag='SAU CS' if lab>='2025-07' else 'truoc CS (ky vong ~0)'
            print(f"    {lab}  beta={bb:+7.3f}  se={se:6.3f}  p={r.pvalues[k]:.3f}  KTC95=[{bb-1.96*se:+6.2f},{bb+1.96*se:+6.2f}]  {tag}")

# ================= SUA LOI 3: TOST day du =================
print("="*72); print("SUA LOI 3 — TOST day du (hai kiem dinh mot phia), bien tuong duong dinh truoc")
def tost(est,se,delta):
    p_lo=1-stats.norm.cdf((est+delta)/se)   # H01: ATT <= -delta
    p_hi=stats.norm.cdf((est-delta)/se)     # H02: ATT >= +delta
    return max(p_lo,p_hi)
for ctrl in ['C10','C8']:
    s=w[w.grp.isin(['T',ctrl])]; r=smf.ols('y ~ T',s).fit(cov_type='HC3')
    est,se=r.params['T'],r.bse['T']
    print(f"  [{ctrl}] ATT={est:+.3f}% se={se:.3f} KTC95=[{est-1.96*se:+.3f},{est+1.96*se:+.3f}]")
    for lab,dl in [('25% pass-through',0.25*abs(TAU)),('50% pass-through',0.50*abs(TAU)),('+-0.5 diem %',0.5)]:
        p=tost(est,se,dl)
        print(f"       TOST bien +-{dl:.3f}% ({lab:18s}): p={p:.4f} -> {'KET LUAN TUONG DUONG' if p<0.05 else 'KHONG ket luan duoc tuong duong'}")
    t=(est-TAU)/se; p_full=2*min(stats.norm.cdf(t),1-stats.norm.cdf(t))
    print(f"       H0: chuyen HOAN TOAN (ATT={TAU:.3f}%): p={p_full:.4f}")

# ================= SUA LOI 4a: bootstrap cum theo SKU =================
print("="*72); print("SUA LOI 4a — Bootstrap cum theo SKU (5000 lan)")
for ctrl in ['C10','C8']:
    s=w[w.grp.isin(['T',ctrl])]; yt=s.loc[s['T']==1,'y'].values; yc=s.loc[s['T']==0,'y'].values
    bs=np.array([np.random.choice(yt,len(yt),True).mean()-np.random.choice(yc,len(yc),True).mean() for _ in range(5000)])
    print(f"  [{ctrl}] ATT bootstrap TB={bs.mean():+.3f}%  KTC95 percentile=[{np.percentile(bs,2.5):+.3f},{np.percentile(bs,97.5):+.3f}]"
          f"  pass-through KTC=[{np.percentile(bs,97.5)/TAU:+.3f},{np.percentile(bs,2.5)/TAU:+.3f}]")
w.to_csv("sku_panel_fixed.csv",index=False)

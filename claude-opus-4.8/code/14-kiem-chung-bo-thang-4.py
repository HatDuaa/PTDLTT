import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np, statsmodels.formula.api as smf
CUT=pd.Timestamp('2025-07-01')
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].dropna(subset=['ma_hh_ct']).copy()
d['sku']=d.ma_hh_ct.astype('int64').astype(str); d['post']=d.dg>=CUT
d['pg']=d.sotien_sauvat_ct/d.soluong_ct; d['thang']=d.dg.dt.to_period('M').astype(str)
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index); c8=set(tab[(tab[False]==8)&(tab[True]==8)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10',np.where(d.sku.isin(c8),'C8','X')))
d=d[d.grp!='X']

def run(ctrl,pre_months,lab):
    s=d[d.grp.isin(['T',ctrl])].copy()
    PRE=s[s.thang.isin(pre_months)]
    cov=PRE.groupby('sku').agg(type=('type',mode),
        dvt=('ten_dvt_ct',lambda z: z.mode().iloc[0] if z.notna().any() else 'NA'),
        pre_p=('pg','median'), pre_q=('soluong_ct','sum')).reset_index()
    pre=PRE.groupby('sku')['pg'].median(); pos=s[s.post].groupby('sku')['pg'].median()
    j=pd.concat([pre.rename('pre'),pos.rename('pos')],axis=1).dropna().reset_index()
    j=j.merge(cov,on='sku'); j['grp']=j.sku.map(s.drop_duplicates('sku').set_index('sku')['grp'])
    j['y']=np.log(j.pos/j.pre)*100; j['T']=(j.grp=='T').astype(int)
    j['lpre']=np.log(j.pre_p); j['lq']=np.log(j.pre_q)
    r0=smf.ols('y ~ T',j).fit(cov_type='HC3')
    r1=smf.ols('y ~ T + C(type) + lpre + lq',j).fit(cov_type='HC3')
    f=lambda r:(r.params['T'],r.bse['T'],r.pvalues['T'])
    e0,s0,p0=f(r0); e1,s1,p1=f(r1)
    print(f"  {lab:30s} [{ctrl}] n={len(j):4d} | tho: {e0:+6.3f} (p={p0:.3f}) | +hiep bien: {e1:+6.3f} (se {s1:.3f}, p={p1:.3f}) {'  <<< CO Y NGHIA' if p1<0.05 else ''}")

print("="*80); print("(J) CO DO 2 — dac ta '+hiep bien' co bien mat khi BO THANG 4 khong?")
for ctrl in ['C10','C8']:
    run(ctrl,['2025-04','2025-05','2025-06'],'Tien ky 04+05+06 (goc)')
    run(ctrl,['2025-05','2025-06'],'Tien ky 05+06 (BO thang 4)')
    run(ctrl,['2025-06'],'Tien ky 06')
    print()

print("="*80); print("(K) THANG 4 DONG GOP BAO NHIEU? so SKU quan sat duoc theo thang")
print(d[~d.post].groupby(['thang','grp'])['sku'].nunique().unstack().to_string())
print("\n  So NGAY co du lieu moi thang:", d.groupby('thang')['dg'].apply(lambda s:s.dt.date.nunique()).to_dict())

print("\n"+"="*80); print("(L) PLACEBO trong noi bo tien ky SACH: 05 vs 06 (khong dinh thang 4)")
s=d[d.thang.isin(['2025-05','2025-06'])].copy()
for ctrl in ['C10','C8']:
    x=s[s.grp.isin(['T',ctrl])]
    a=x[x.thang=='2025-05'].groupby('sku')['pg'].median(); bb=x[x.thang=='2025-06'].groupby('sku')['pg'].median()
    j=pd.concat([a.rename('a'),bb.rename('b')],axis=1).dropna().reset_index()
    j['grp']=j.sku.map(x.drop_duplicates('sku').set_index('sku')['grp'])
    j['y']=np.log(j.b/j.a)*100; j['T']=(j.grp=='T').astype(int)
    r=smf.ols('y ~ T',j).fit(cov_type='HC3')
    e,se=r.params['T'],r.bse['T']
    print(f"  [{ctrl}] n={len(j):4d}  placebo 05->06: beta={e:+.3f}  se={se:.3f}  p={r.pvalues['T']:.3f}  KTC=[{e-1.96*se:+.2f},{e+1.96*se:+.2f}]")

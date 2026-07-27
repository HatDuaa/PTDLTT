import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np, statsmodels.formula.api as smf
from scipy import stats
np.random.seed(7)
CUT=pd.Timestamp('2025-07-01')
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].dropna(subset=['ma_hh_ct']).copy()
d['sku']=d.ma_hh_ct.astype('int64').astype(str); d['post']=d.dg>=CUT
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10','X')); d=d[d.grp!='X']
d['w']=d.dg.dt.to_period('W')
q=d.groupby(['sku','grp','w'])['soluong_ct'].sum().reset_index()
allw=sorted(d['w'].unique()); rows=[]
for (sku,grp),gg in q.groupby(['sku','grp']):
    lo,hi=gg.w.min(),gg.w.max(); mp=dict(zip(gg.w,gg.soluong_ct))
    for x in [z for z in allw if lo<=z<=hi]: rows.append((sku,grp,str(x),mp.get(x,0)))
p=pd.DataFrame(rows,columns=['sku','grp','w','q'])
p['post']=pd.PeriodIndex(p.w,freq='W').start_time>=CUT
p['T']=(p.grp=='T').astype(int); p['D']=p['T']*p['post'].astype(int)
base=p.loc[(p['T']==1)&(~p.post),'q'].mean()
r=smf.ols('q ~ D + C(sku) + C(w)',p).fit(cov_type='cluster',cov_kwds={'groups':p.sku})
est,se=r.params['D'],r.bse['D']
print(f"Panel {len(p)} o | q TB nhom T truoc CS = {base:.3f}")
print(f"ATT san luong = {est:+.4f} don vi/SKU-tuan (se={se:.4f}, p={r.pvalues['D']:.3f})")
print(f"  = {est/base*100:+.1f}% so voi nen\n")
print("DUONG CONG SUC MANH (mo phong 2000 lan/muc, them tac dong that vao o treated&post)")
Xd=pd.get_dummies(p[['sku','w']],drop_first=True).astype(float); Xd.insert(0,'D',p['D'].values); Xd.insert(0,'const',1.0)
import numpy.linalg as la
XtXi=la.pinv(Xd.T.values@Xd.values); H=XtXi@Xd.T.values   # beta = H @ y
resid=r.resid.values
print(f"{'tac dong that':>16} {'= % nen':>9} {'ty le bac bo H0':>16}")
for pct in [5,10,20,30,50,80,100]:
    tau=base*pct/100; rej=0; N=2000
    for _ in range(N):
        y=r.fittedvalues.values+np.random.choice(resid,len(resid),True)+tau*p['D'].values
        bh=(H@y)[1]
        if abs(bh/se)>1.96: rej+=1
    print(f"{tau:16.3f} {pct:8d}% {rej/N:15.1%}")
print("\nMDE giai tich (power 80%, alpha 5%) = (1.96+0.8416)*se =",
      f"{(1.96+0.8416)*se:.3f} don vi = {(1.96+0.8416)*se/base*100:.0f}% so voi nen")

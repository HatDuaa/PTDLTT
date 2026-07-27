import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np, statsmodels.formula.api as smf
from scipy import stats
np.random.seed(42)
CUT=pd.Timestamp('2025-07-01'); TAU=np.log(1.08/1.10)*100
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
# DAC TA SACH: bo thang 4 (chi 10 ngay, ngay sau lo hong 39 ngay, he thong ma vach vua chay)
d=d[(d.dg>=pd.Timestamp('2025-05-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].dropna(subset=['ma_hh_ct']).copy()
d['sku']=d.ma_hh_ct.astype('int64').astype(str); d['post']=d.dg>=CUT
d['pg']=d.sotien_sauvat_ct/d.soluong_ct; d['pn']=d.sotien_ct/d.soluong_ct
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index); c8=set(tab[(tab[False]==8)&(tab[True]==8)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10',np.where(d.sku.isin(c8),'C8','X')))
d=d[d.grp!='X']
print(f"DAC TA SACH — tien ky = 05+06/2025, hau ky = 07+08/2025")
print(f"  T={len(tr)}  C10={len(c10)}  C8={len(c8)}  |  {len(d)} dong hang\n")
w=d.pivot_table(index=['sku','grp'],columns='post',values=['pg','pn'],aggfunc='median').dropna().reset_index()
w.columns=['sku','grp','pg_pre','pg_pos','pn_pre','pn_pos']
w['y']=np.log(w.pg_pos/w.pg_pre)*100; w['yn']=np.log(w.pn_pos/w.pn_pre)*100; w['T']=(w.grp=='T').astype(int)
def tost(e,se,dl): return max(1-stats.norm.cdf((e+dl)/se), stats.norm.cdf((e-dl)/se))
print("="*78); print("KET QUA CHINH")
for ctrl in ['C10','C8']:
    s=w[w.grp.isin(['T',ctrl])]
    r=smf.ols('y ~ T',s).fit(cov_type='HC3'); e,se=r.params['T'],r.bse['T']
    rn=smf.ols('yn ~ T',s).fit(cov_type='HC3')
    print(f"\n  [{ctrl}] n={len(s)}")
    print(f"    ATT gia GOM thue  = {e:+.3f}%  se={se:.3f}  p={r.pvalues['T']:.3f}  KTC95=[{e-1.96*se:+.3f},{e+1.96*se:+.3f}]")
    print(f"    ATT gia CHUA thue = {rn.params['T']:+.3f}%  p={rn.pvalues['T']:.4f}")
    print(f"    Pass-through = {e/TAU:+.3f}  KTC95=[{(e+1.96*se)/TAU:+.3f},{(e-1.96*se)/TAU:+.3f}]")
    t=(e-TAU)/se; pf=2*min(stats.norm.cdf(t),1-stats.norm.cdf(t))
    print(f"    H0 chuyen HOAN TOAN ({TAU:.3f}%): p={pf:.4f} -> {'BAC BO' if pf<0.05 else 'khong bac bo'}")
    for lab,dl in [('25% pass-through',0.25*abs(TAU)),('50% pass-through',0.50*abs(TAU))]:
        print(f"    TOST bien +-{dl:.3f}% ({lab}): p={tost(e,se,dl):.4f} -> {'TUONG DUONG' if tost(e,se,dl)<0.05 else 'khong ket luan duoc'}")
    bs=np.array([np.random.choice(s.loc[s['T']==1,'y'].values,int(s['T'].sum()),True).mean()
                -np.random.choice(s.loc[s['T']==0,'y'].values,int((1-s['T']).sum()),True).mean() for _ in range(5000)])
    print(f"    Bootstrap KTC95=[{np.percentile(bs,2.5):+.3f},{np.percentile(bs,97.5):+.3f}]")
print("\n"+"="*78); print("KIEM DINH VUNG (dac ta sach)")
print(f"  Placebo trong tien ky 05->06 : C10 beta=-0.384 (p=0.474) | C8 beta=-0.562 (p=0.274)   [tu cored5]")
sub=d[d.dg>=pd.Timestamp('2025-06-11')]
w2=sub.pivot_table(index=['sku','grp'],columns='post',values='pg',aggfunc='median').dropna().reset_index()
w2.columns=['sku','grp','pre','pos']; w2['y']=np.log(w2.pos/w2.pre)*100; w2['T']=(w2.grp=='T').astype(int)
for ctrl in ['C10','C8']:
    s2=w2[w2.grp.isin(['T',ctrl])]; r=smf.ols('y ~ T',s2).fit(cov_type='HC3')
    print(f"  Cua so hep (tu 11/06, chi dia diem moi) [{ctrl}] n={len(s2):4d} beta={r.params['T']:+.3f} p={r.pvalues['T']:.3f}")

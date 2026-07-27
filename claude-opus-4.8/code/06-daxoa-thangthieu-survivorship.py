import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
print("="*70); print("(A) daxoa=2 LA GI?")
b=g[g.ma_ncc_hddt=='THUE_BANRA'].copy()
x=b[b.daxoa=='2']; y=b[b.daxoa=='0']
print("  n(daxoa=2)=",len(x)," khoang ngay:",x.dg.min().date(),"->",x.dg.max().date())
for col in ['hoadon_ten_tinhtrang','ten_tinhtrangxuly','hoadon_kyhieu','nguoitao','ma_kyketoan']:
    print(f"  {col}: daxoa=2 -> {x[col].value_counts(dropna=False).head(3).to_dict()}")
    print(f"  {' '*len(col)}  daxoa=0 (thang 5) -> {y[y.dg.dt.month==5][col].value_counts(dropna=False).head(3).to_dict()}")
print("  so hoa don trung so:", x.hoadon_so.isin(y.hoadon_so).sum(), "/", len(x))
print("  tien TB: daxoa=2 =", pd.to_numeric(x.sotien_sauvat).mean().round(0), "| daxoa=0 thang5 =", pd.to_numeric(y[y.dg.dt.month==5].sotien_sauvat).mean().round(0))
print("  ngay trong thang 5: daxoa=2 ->", sorted(x.dg.dt.day.unique())[:15], "...")
print("  ngay trong thang 5: daxoa=0 ->", sorted(y[y.dg.dt.month==5].dg.dt.day.unique())[:15], "...")

print("="*70); print("(B) VI SAO THANG 2-3 ROT KHOI EVENT STUDY?")
bb=b[b.daxoa=='0']
d=c.merge(bb[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].dropna(subset=['ma_hh_ct']).copy()
d['sku']=d.ma_hh_ct.astype('int64').astype(str); d['post']=d.dg>=pd.Timestamp('2025-07-01')
mode=lambda s:s.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10','X'))
d=d[d.grp!='X']; d['thang']=d.dg.dt.to_period('M').astype(str)
print("  So SKU co giao dich theo thang:")
print(d.groupby(['thang','grp'])['sku'].nunique().unstack().to_string())
print("\n  So dong hang theo thang:")
print(d.groupby(['thang','grp']).size().unstack().to_string())

print("="*70); print("(C) SURVIVORSHIP: SKU bi loai khi yeu cau >=3 tuan quan sat gia")
pre=d[~d.post].copy()
n=pre.groupby(['sku','grp']).apply(lambda x: x.dg.dt.to_period('W').nunique()).reset_index(name='ntuan')
pre_p=pre.assign(pg=pre.sotien_sauvat_ct/pre.soluong_ct).groupby('sku')['pg'].median()
n['gia']=n.sku.map(pre_p); n['giu']=(n.ntuan>=3)
print(n.groupby(['grp','giu']).agg(n_sku=('sku','size'),gia_median=('gia','median'),tuan_median=('ntuan','median')).to_string())

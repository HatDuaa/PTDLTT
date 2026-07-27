import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np
pd.set_option('display.width',200)
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].copy()

print("="*74); print("(A) TRUONG MA VACH DUOC DIEN TU KHI NAO? (ty le dong co ma_hh_ct theo tuan)")
d['w']=d.dg.dt.to_period('W')
cov=d.groupby('w').agg(n=('ma_hh_ct','size'),co_ma=('ma_hh_ct',lambda s:s.notna().sum()))
cov['ty_le']=(cov.co_ma/cov.n*100).round(1)
print(cov.head(24).to_string())

print("\n"+"="*74); print("(B) THANG 4 CO DU NGAY KHONG? (so ngay co du lieu co ma vach, theo thang)")
dm=d.dropna(subset=['ma_hh_ct']).copy()
print(dm.groupby(dm.dg.dt.to_period('M')).agg(so_ngay=('dg',lambda s:s.dt.date.nunique()),
      ngay_dau=('dg','min'), ngay_cuoi=('dg','max'), so_dong=('dg','size')).to_string())
import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')].copy()
print("="*74); print("(C) BAN DO LO HONG: cac khoang NGAY KHONG CO hoa don ban ra nao (tu 01/02/2025)")
days=pd.Series(sorted(b[b.dg>=pd.Timestamp('2025-02-01')].dg.dt.normalize().unique()))
full=pd.date_range(days.min(),days.max(),freq='D')
missing=sorted(set(full)-set(days))
# gom thanh khoang lien tuc
runs=[];start=prev=None
for x in missing:
    if start is None: start=prev=x; continue
    if (x-prev).days==1: prev=x
    else: runs.append((start,prev)); start=prev=x
if start is not None: runs.append((start,prev))
for s,e in runs:
    n=(e-s).days+1
    if n>=2: print(f"  THIEU {n:3d} ngay: {s.date()} -> {e.date()}")
print(f"  Tong: {len(days)} ngay co du lieu / {len(full)} ngay trong ky")
print("\n  So hoa don theo thang (ban ra, daxoa=0):")
print(b[b.dg>=pd.Timestamp('2025-02-01')].groupby(b.dg.dt.to_period('M')).size().to_string())

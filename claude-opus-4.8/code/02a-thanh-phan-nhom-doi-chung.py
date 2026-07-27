import pandas as pd, numpy as np
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
banra=g[g.ma_ncc_hddt=='THUE_BANRA']
print("=== (2) Hoa don BAN RA theo thang ===")
print(banra['dg'].dt.to_period('M').value_counts().sort_index().to_string())
keep=set(banra['soid'])
c=c[c.soid.isin(keep)].copy()
c['d']=pd.to_datetime(c['ngayct_ct']); c['post']=c['d']>=pd.Timestamp('2025-07-01')
c=c[(c.d>=pd.Timestamp('2025-02-01'))&(c.soluong_ct>0)]
s=c.dropna(subset=['ma_hh_ct']).copy(); s['sku']=s['ma_hh_ct'].astype('int64').astype(str)
mode=lambda x:x.mode().iloc[0]
tab=s.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr =tab[(tab[False]==10)&(tab[True]==8)].index
c10=tab[(tab[False]==10)&(tab[True]==10)].index
c8 =tab[(tab[False]==8)&(tab[True]==8)].index
print(f"\n=== Sau khi chi giu BAN RA, tu 02/2025: treated={len(tr)} ctrl10={len(c10)} ctrl8={len(c8)}")
print("\n=== (1) 162 SKU giu 10% la hang gi? Top 30 ten ===")
n=s[s.sku.isin(c10)].groupby('ten_hh_ct').size().sort_values(ascending=False)
print(n.head(30).to_string())
print("\ntype cua ctrl10:", s[s.sku.isin(c10)]['type'].value_counts().to_dict())
print("type cua treated:", s[s.sku.isin(tr)]['type'].value_counts().to_dict())
print("\nGia median: treated", (s[s.sku.isin(tr)].sotien_sauvat_ct/s[s.sku.isin(tr)].soluong_ct).median(),
      "| ctrl10", (s[s.sku.isin(c10)].sotien_sauvat_ct/s[s.sku.isin(c10)].soluong_ct).median(),
      "| ctrl8", (s[s.sku.isin(c8)].sotien_sauvat_ct/s[s.sku.isin(c8)].soluong_ct).median())

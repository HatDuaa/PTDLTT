import pandas as pd, numpy as np
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)].copy()
d['pg']=d.sotien_sauvat_ct/d.soluong_ct
print("=== (A) DIEM GIA TAM LY: gia niem yet co tron khong? ===")
p=d.pg.round(0)
for m in [1000,500,100]:
    print(f"  % gia chia het {m}: {(p%m==0).mean():.1%}")
print("  Top 12 muc gia pho bien:", p.value_counts().head(12).index.astype(int).tolist())
print("\n=== (B) NGHICH LY SIMPSON: ty le SKU doi gia, gop vs tach nhom hang ===")
d['post']=d.dg>=pd.Timestamp('2025-07-01'); d=d.dropna(subset=['ma_hh_ct']); d['sku']=d.ma_hh_ct.astype('int64').astype(str)
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10','X'))
w=d[d.grp!='X'].pivot_table(index=['sku','grp'],columns='post',values='pg',aggfunc='median').dropna()
w.columns=['pre','pos']; w=w.reset_index()
w['tang']=(np.log(w.pos/w.pre)>0.005).astype(int)
ty=d[d.grp!='X'].groupby('sku')['type'].agg(mode); w['type']=w.sku.map(ty)
print("  GOP:"); print(w.groupby('grp')['tang'].agg(['mean','count']).round(3).to_string())
print("  TACH theo nhom hang:"); print(w.groupby(['type','grp'])['tang'].agg(['mean','count']).round(3).to_string())
print("\n=== (C) DU LIEU GIO HANG cho mang Bayes (ch.7) ===")
bs=d.groupby('soid').agg(n=('sku','size'),tien=('sotien_sauvat_ct','sum'))
print("  so hoa don:",len(bs)," so mon/HD:",bs.n.describe()[['mean','50%','max']].round(2).to_dict())
piv=d.pivot_table(index='soid',columns='type',values='soluong_ct',aggfunc='sum').fillna(0)
piv=(piv>0).astype(int)
print("  ty le HD co tung nhom:",piv.mean().round(3).to_dict())
print("  tuong quan tho giua cac nhom:"); print(piv.corr().round(3).to_string())
hi=bs[bs.n>=3].index
print("  tuong quan KHI DIEU KIEN HOA tren gio >=3 mon (kiem tra Berkson):")
print(piv.loc[piv.index.isin(hi)].corr().round(3).to_string())

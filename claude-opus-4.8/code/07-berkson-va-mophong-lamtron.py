import pandas as pd, numpy as np
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)]
sp=d.pivot_table(index='soid',columns='type',values='sotien_sauvat_ct',aggfunc='sum').fillna(0)
sp['tong']=sp.sum(axis=1)
print("=== BERKSON: tuong quan chi tieu giua cac nhom hang ===")
print("Toan bo hoa don (n=%d):"%len(sp)); print(sp[['Nước uống','Đồ ăn','Sản phẩm khác']].corr().round(3).to_string())
for lo,hi,lab in [(0,50000,'gio NHO <50k'),(50000,150000,'gio VUA 50-150k'),(150000,1e12,'gio LON >150k')]:
    s=sp[(sp.tong>=lo)&(sp.tong<hi)]
    cr=s[['Nước uống','Đồ ăn','Sản phẩm khác']].corr()
    print(f"\n{lab} (n={len(s)}): r(Nuoc,DoAn)={cr.loc['Nước uống','Đồ ăn']:.3f}  r(Nuoc,Khac)={cr.loc['Nước uống','Sản phẩm khác']:.3f}  r(DoAn,Khac)={cr.loc['Đồ ăn','Sản phẩm khác']:.3f}")
print("\n=== MO PHONG lam tron gia (ch.11): neu chuyen 100% giam thue roi lam tron ===")
d2=d.dropna(subset=['ma_hh_ct']).copy(); d2['sku']=d2.ma_hh_ct.astype('int64').astype(str); d2['post']=d2.dg>=pd.Timestamp('2025-07-01')
mode=lambda x:x.mode().iloc[0]
tab=d2.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=tab[(tab[False]==10)&(tab[True]==8)].index
pre=d2[(d2.sku.isin(tr))&(~d2.post)].assign(pg=lambda x:x.sotien_sauvat_ct/x.soluong_ct).groupby('sku')['pg'].median()
new=pre*(1.08/1.10)
for m in [1000,500]:
    r=(np.round(new/m)*m)
    print(f"  Neu lam tron boi so {m}: {(r!=pre).mean():.1%} SKU se doi gia (thuc te quan sat: 0%~ khong doi)")
print(f"  Neu KHONG lam tron: 100% SKU se doi gia. Muc giam trung binh = {(pre-new).median():.0f}d tren gia trung vi {pre.median():.0f}d")

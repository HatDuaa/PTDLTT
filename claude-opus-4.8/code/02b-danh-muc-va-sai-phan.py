import pandas as pd, numpy as np
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct']); g['store']=g['diachi_ban'].str[:12]
b=g[g.ma_ncc_hddt=='THUE_BANRA']
c=c.merge(b[['soid','dg','store']],on='soid',how='inner')
c=c[(c.dg>=pd.Timestamp('2025-02-01'))&(c.soluong_ct>0)].copy()
c['post']=c['dg']>=pd.Timestamp('2025-07-01')
s=c.dropna(subset=['ma_hh_ct']).copy(); s['sku']=s['ma_hh_ct'].astype('int64').astype(str)
mode=lambda x:x.mode().iloc[0]
tab=s.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index); c8=set(tab[(tab[False]==8)&(tab[True]==8)].index)
s['grp']=np.where(s.sku.isin(tr),'treated',np.where(s.sku.isin(c10),'ctrl10',np.where(s.sku.isin(c8),'ctrl8','other')))
s['pg']=s.sotien_sauvat_ct/s.soluong_ct
print("=== (3) SKU vao/ra danh muc quanh moc doi cua hang (moc doi ~ 2025-06-10) ===")
old=set(s[s.store.str.startswith('08')]['sku']); new=set(s[~s.store.str.startswith('08')]['sku'])
for gname,idx in [('treated',tr),('ctrl10',c10),('ctrl8',c8)]:
    a=len(idx&old&new); b_=len(idx&old-new); d=len(idx&new-old)
    print(f"{gname:8s} ca 2 dia diem={a:5d}  chi cho cu={b_:4d}  chi cho moi={d:4d}")
print("\n=== (4) Kha thi sai phan bac nhat: SKU co gia ca TRUOC va SAU 1/7 ===")
for gname in ['treated','ctrl10','ctrl8']:
    x=s[s.grp==gname]
    pre=x[~x.post].groupby('sku')['pg'].median(); po=x[x.post].groupby('sku')['pg'].median()
    j=pd.concat([pre.rename('pre'),po.rename('post')],axis=1).dropna()
    dl=np.log(j['post']/j['pre'])*100
    print(f"{gname:8s} n_SKU co ca 2={len(j):5d} | %doi gia gross: median={dl.median():.2f} mean={dl.mean():.2f} | giu nguyen(|d|<0.5%)={(dl.abs()<0.5).mean():.1%}")
print("\n=== Cua so hep: chi dia diem MOI (15/6 - 17/8) ===")
sn=s[(~s.store.str.startswith('08'))&(s.dg>=pd.Timestamp('2025-06-10'))]
for gname in ['treated','ctrl10','ctrl8']:
    x=sn[sn.grp==gname]
    pre=x[~x.post].groupby('sku')['pg'].median(); po=x[x.post].groupby('sku')['pg'].median()
    j=pd.concat([pre.rename('pre'),po.rename('post')],axis=1).dropna()
    print(f"{gname:8s} n_SKU co ca 2 trong cua so hep={len(j)}")

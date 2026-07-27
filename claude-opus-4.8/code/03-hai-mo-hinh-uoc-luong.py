import pandas as pd, numpy as np, statsmodels.formula.api as smf
np.random.seed(42)
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct']); g['store']=np.where(g['diachi_ban'].str.startswith('08'),'cu','moi')
b=g[(g.ma_ncc_hddt=='THUE_BANRA')]
print("daxoa=2 theo thang (hoa don ban ra):")
print(pd.crosstab(b['dg'].dt.to_period('M'), b['daxoa']).to_string())
b=b[b.daxoa=='0']
d=c.merge(b[['soid','dg','store']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)&(d.sotien_ct>0)].copy()
d['post']=d.dg>=pd.Timestamp('2025-07-01')
d=d.dropna(subset=['ma_hh_ct']); d['sku']=d.ma_hh_ct.astype('int64').astype(str)
d['pg']=d.sotien_sauvat_ct/d.soluong_ct; d['pn']=d.sotien_ct/d.soluong_ct
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index); c8=set(tab[(tab[False]==8)&(tab[True]==8)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10',np.where(d.sku.isin(c8),'C8','X')))
d=d[d.grp!='X']
print(f"\nMau cuoi: {len(d)} dong | T={len(tr)} C10={len(c10)} C8={len(c8)}")

# ---- SKU-level panel
sk=d.groupby(['sku','grp','post'])[['pg','pn']].median().reset_index()
w=sk.pivot_table(index=['sku','grp'],columns='post',values=['pg','pn']).dropna().reset_index()
w.columns=['sku','grp','pg_pre','pg_post','pn_pre','pn_post']
w['dlpg']=np.log(w.pg_post/w.pg_pre)*100; w['dlpn']=np.log(w.pn_post/w.pn_pre)*100
w['keep_price']=(w.dlpg.abs()<0.5).astype(int)
w['T']=(w.grp=='T').astype(int)
# hiep bien
cov=d.groupby('sku').agg(type=('type',mode),dvt=('ten_dvt_ct',lambda s: s.mode().iloc[0] if s.notna().any() else 'NA'),
                          pre_p=('pg',lambda s: s.median()), nq=('soluong_ct','sum')).reset_index()
w=w.merge(cov,on='sku'); w['lpre']=np.log(w.pre_p); w['lnq']=np.log(w.nq)
print("\n=== Thong ke mo ta theo nhom (Delta log gia, %) ===")
print(w.groupby('grp')[['dlpg','dlpn','keep_price']].agg(['count','mean','median']).round(2).to_string())

TAU=np.log(1.08/1.10)*100  # -1.835%
print(f"\nMuc giam thue ky vong neu chuyen 100% sang gia: {TAU:.3f}%")

def show(name,res,var='T'):
    b_=res.params[var]; se=res.bse[var]; p=res.pvalues[var]
    print(f"{name:52s} beta={b_:7.3f}  se={se:6.3f}  p={p:6.3f}  KTC95=[{b_-1.96*se:6.3f},{b_+1.96*se:6.3f}]")

print("\n########## MO HINH 1 — Dieu chinh cua sau, cat ngang SAU 1/7 (co tinh CHECH) ##########")
post=d[d.post & d.grp.isin(['T','C10'])].copy(); post['T']=(post.grp=='T').astype(int); post['lpg']=np.log(post.pg)
show("M1a tho: log(gia) ~ T (khong dieu chinh)", smf.ols('lpg ~ T',post).fit(cov_type='cluster',cov_kwds={'groups':post.sku}))
show("M1b dieu chinh type+dvt", smf.ols('lpg ~ T + C(type) + C(ten_dvt_ct)',post).fit(cov_type='cluster',cov_kwds={'groups':post.sku}))
print("  -> Uoc luong nay tra loi: 'sau 1/7, hang duoc giam thue co gia cao/thap hon bao nhieu %'. KHONG phai tac dong nhan qua.")

print("\n########## MO HINH 2 — ATT bang sai phan co doi chung (khung ket qua tiem nang) ##########")
for ctrl in ['C10','C8']:
    s2=w[w.grp.isin(['T',ctrl])]
    r=smf.ols('dlpg ~ T',s2).fit(cov_type='HC3'); show(f"M2 [{ctrl}] Y=Dlog(gia GOM thue)",r)
    r2=smf.ols('dlpg ~ T + C(type) + lpre + lnq',s2).fit(cov_type='HC3'); show(f"M2 [{ctrl}] + hiep bien",r2)
    r3=smf.ols('dlpn ~ T',s2).fit(cov_type='HC3'); show(f"M2 [{ctrl}] Y=Dlog(gia CHUA thue)",r3)
    r4=smf.logit('keep_price ~ T',s2).fit(disp=0); show(f"M2 [{ctrl}] logistic: P(giu nguyen gia)",r4)
    pt=r.params['T']/TAU
    print(f"  -> Ty le chuyen giam thue sang nguoi tieu dung (pass-through) = {pt:.3f}  (0=nguoi ban giu het, 1=chuyen het)\n")

print("########## Kiem dinh hoan vi Monte Carlo (M2, doi chung C10, 5000 lan) ##########")
s2=w[w.grp.isin(['T','C10'])]
obs=s2[s2.T==1].dlpg.mean()-s2[s2.T==0].dlpg.mean()
y=s2.dlpg.values; n1=int(s2['T'].sum()); null=[]
for _ in range(5000):
    p=np.random.permutation(y); null.append(p[:n1].mean()-p[n1:].mean())
null=np.array(null); pv=(np.abs(null)>=abs(obs)).mean()
print(f"Chenh lech quan sat = {obs:.3f}%  | p-value hoan vi = {pv:.4f}  | KTC null 95% = [{np.percentile(null,2.5):.2f},{np.percentile(null,97.5):.2f}]")

print("\n########## Kiem dinh gia duoc: moc gia 01/05/2025 (truoc chinh sach) ##########")
pl=d[d.dg<pd.Timestamp('2025-07-01')].copy(); pl['post2']=pl.dg>=pd.Timestamp('2025-05-01')
sk2=pl.groupby(['sku','grp','post2'])['pg'].median().unstack().dropna()
sk2['dl']=np.log(sk2[True]/sk2[False])*100; sk2=sk2.reset_index(); sk2['T']=(sk2.grp=='T').astype(int)
s3=sk2[sk2.grp.isin(['T','C10'])]
show(f"PLACEBO 1/5 [n={len(s3)}] Dlog(gia gom thue)", smf.ols('dl ~ T',s3).fit(cov_type='HC3'))
print("  -> Ky vong: beta ~ 0. Neu khac 0 co y nghia => xu huong song song bi nghi ngo.")
w.to_csv("sku_panel.csv",index=False)

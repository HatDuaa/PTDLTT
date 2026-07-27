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

def es(df,ctrl,lab,freq='M'):
    s=df[df.grp.isin(['T',ctrl])].copy()
    key='thang' if freq=='M' else 'tuan'
    mm=s.groupby(['sku','grp',key])['pg'].median().reset_index(); mm['ly']=np.log(mm.pg)*100
    mm['T']=(mm.grp=='T').astype(int)
    ref='2025-06' if freq=='M' else None
    r=smf.ols(f"ly ~ C({key}, Treatment('{ref}'))*T + C(sku)",mm).fit(cov_type='cluster',cov_kwds={'groups':mm.sku})
    out=[]
    for k in r.params.index:
        if k.startswith(f"C({key}") and ":T" in k:
            p=k.split('[T.')[1].split(']')[0]
            out.append((p,r.params[k],r.bse[k],r.pvalues[k]))
    print(f"\n  {lab} | doi chung {ctrl} | n_sku={mm.sku.nunique()}, n_obs={len(mm)}")
    for p,bb,se,pv in sorted(out):
        tag='SAU' if p>='2025-07' else 'truoc'
        print(f"    {p}  beta={bb:+7.3f}  se={se:6.3f}  p={pv:.3f}  [{bb-1.96*se:+6.2f},{bb+1.96*se:+6.2f}]  {tag}")

print("="*74); print("(D) DAC TA GOC — toan mau (thang 4 chi co 10 ngay 21-30/04)")
for ctrl in ['C10','C8']: es(d,ctrl,'GOC')

print("\n"+"="*74); print("(E) GIA THUYET 1: SKU MOI GIA NHAP — chi giu SKU co mat CA 3 thang tien ky 04,05,06")
pre=d[~d.post]
have=pre.groupby('sku')['thang'].apply(lambda s:set(s))
bal=set(have[have.apply(lambda x:{'2025-04','2025-05','2025-06'}<=x)].index)
print(f"  SKU can bang: T={len(bal&tr)}/{len(tr)}  C10={len(bal&c10)}/{len(c10)}  C8={len(bal&c8)}/{len(c8)}")
for ctrl in ['C10','C8']: es(d[d.sku.isin(bal)],ctrl,'CAN BANG 3 thang')

print("\n"+"="*74); print("(F) GIA THUYET 2: THANG 4 CHI 10 NGAY (21-30/04, sat le 30/4-1/5)")
print("  -> Doi cua so: chi giu 21-30 cua MOI thang de so sanh cung ky trong thang")
d2=d[d.dg.dt.day>=21].copy()
for ctrl in ['C10']: es(d2,ctrl,'CHI NGAY 21-31 moi thang')
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

print("="*74); print("(G) GIA TRUNG VI TRONG TUNG SKU: doi so voi thang 5, theo nhom (diem %)")
w=d.groupby(['sku','grp','thang'])['pg'].median().unstack()
for gname in ['T','C10','C8']:
    x=w[w.index.get_level_values('grp')==gname]
    base=x['2025-05']
    row=[]
    for m in ['2025-04','2025-06','2025-07','2025-08']:
        v=(np.log(x[m]/base)*100).dropna()
        row.append(f"{m[-2:]}: {v.median():+6.2f} (n={len(v)})")
    print(f"  {gname:4s} " + " | ".join(row))

print("\n"+"="*74); print("(H) TY LE SKU CO GIA KHAC nhau giua thang 4 va thang 5 (trong cung SKU)")
for gname in ['T','C10','C8']:
    x=w[w.index.get_level_values('grp')==gname]
    j=x[['2025-04','2025-05']].dropna()
    dl=np.log(j['2025-05']/j['2025-04'])*100
    print(f"  {gname:4s} n={len(j):4d} | %SKU doi gia 4->5: {(dl.abs()>0.5).mean():5.1%} | trung vi doi: {dl.median():+.2f} | TB: {dl.mean():+.2f}")

print("\n"+"="*74); print("(I) ATT CHINH khi DOI DINH NGHIA KY TIEN CAN THIEP")
def att(df,ctrl,pre_months,lab):
    s=df[df.grp.isin(['T',ctrl])].copy()
    pre=s[s.thang.isin(pre_months)].groupby('sku')['pg'].median()
    pos=s[s.post].groupby('sku')['pg'].median()
    j=pd.concat([pre.rename('pre'),pos.rename('pos')],axis=1).dropna()
    j['grp']=j.index.map(s.drop_duplicates('sku').set_index('sku')['grp'])
    j['y']=np.log(j.pos/j.pre)*100; j['T']=(j.grp=='T').astype(int)
    r=smf.ols('y ~ T',j).fit(cov_type='HC3')
    e,se=r.params['T'],r.bse['T']
    print(f"  {lab:36s} [{ctrl}] n={len(j):4d}  ATT={e:+.3f}  se={se:.3f}  p={r.pvalues['T']:.3f}  KTC=[{e-1.96*se:+.2f},{e+1.96*se:+.2f}]")
for ctrl in ['C10','C8']:
    att(d,ctrl,['2025-04','2025-05','2025-06'],'Tien ky = 04+05+06 (goc)')
    att(d,ctrl,['2025-05','2025-06'],'Tien ky = 05+06 (BO thang 4)')
    att(d,ctrl,['2025-06'],'Tien ky = 06 (sat moc nhat)')
    print()

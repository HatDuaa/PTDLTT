import pandas as pd, numpy as np, statsmodels.formula.api as smf
np.random.seed(42)
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct'])
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)&(d.sotien_ct>0)].copy()
d['post']=d.dg>=pd.Timestamp('2025-07-01'); d=d.dropna(subset=['ma_hh_ct'])
d['sku']=d.ma_hh_ct.astype('int64').astype(str); d['pg']=d.sotien_sauvat_ct/d.soluong_ct
mode=lambda x:x.mode().iloc[0]
tab=d.groupby(['sku','post'])['tyle_vat_ct'].agg(mode).unstack().dropna()
tr=set(tab[(tab[False]==10)&(tab[True]==8)].index); c10=set(tab[(tab[False]==10)&(tab[True]==10)].index)
d['grp']=np.where(d.sku.isin(tr),'T',np.where(d.sku.isin(c10),'C10','X')); d=d[d.grp!='X']

def diff(cut,lo,hi,lab):
    x=d[(d.dg>=lo)&(d.dg<hi)].copy(); x['p2']=np.where(x.dg>=cut,'pos','pre')
    s=x.pivot_table(index=['sku','grp'],columns='p2',values='pg',aggfunc='median')
    if 'pre' not in s or 'pos' not in s: print(lab,"THIEU KY"); return None
    s=s.dropna().reset_index()
    s['y']=np.log(s['pos']/s['pre'])*100; s['T']=(s.grp=='T').astype(int)
    r=smf.ols('y ~ T',s).fit(cov_type='HC3')
    print(f"{lab:44s} n={len(s):4d}  beta={r.params['T']:6.3f}  se={r.bse['T']:5.3f}  p={r.pvalues['T']:.3f}")
    return s

print("=== Kiem dinh gia duoc tai nhieu moc (ky vong beta~0) va moc that 1/7 ===")
diff(pd.Timestamp('2025-04-01'),pd.Timestamp('2025-02-01'),pd.Timestamp('2025-06-01'),"PLACEBO 1/4 (cua so 2-5/2025)")
diff(pd.Timestamp('2025-05-01'),pd.Timestamp('2025-03-01'),pd.Timestamp('2025-07-01'),"PLACEBO 1/5 (cua so 3-6/2025)")
diff(pd.Timestamp('2025-06-01'),pd.Timestamp('2025-04-01'),pd.Timestamp('2025-07-01'),"PLACEBO 1/6 = moc doi cua hang")
s=diff(pd.Timestamp('2025-07-01'),pd.Timestamp('2025-02-01'),pd.Timestamp('2025-09-01'),"THAT 1/7 (toan bo mau)")
diff(pd.Timestamp('2025-07-01'),pd.Timestamp('2025-06-10'),pd.Timestamp('2025-09-01'),"THAT 1/7 (cua so hep, chi dia diem MOI)")

print("\n=== Hoan vi Monte Carlo, moc that 1/7, 10000 lan ===")
y=s['y'].values; n1=int(s['T'].sum()); obs=s.loc[s['T']==1,'y'].mean()-s.loc[s['T']==0,'y'].mean()
null=np.array([ (lambda p:p[:n1].mean()-p[n1:].mean())(np.random.permutation(y)) for _ in range(10000)])
print(f"chenh lech quan sat={obs:.3f}%  p_hoanvi={(np.abs(null)>=abs(obs)).mean():.4f}  null KTC95=[{np.percentile(null,2.5):.2f},{np.percentile(null,97.5):.2f}]")

print("\n=== SAN LUONG: panel SKU x tuan, dien 0 trong vong doi SKU ===")
d['w']=d.dg.dt.to_period('W')
q=d.groupby(['sku','grp','w'])['soluong_ct'].sum().reset_index()
allw=sorted(d['w'].unique()); rows=[]
for (sku,grp),gg in q.groupby(['sku','grp']):
    lo,hi=gg.w.min(),gg.w.max(); rng=[x for x in allw if lo<=x<=hi]
    m=dict(zip(gg.w,gg.soluong_ct))
    for x in rng: rows.append((sku,grp,x,m.get(x,0)))
p=pd.DataFrame(rows,columns=['sku','grp','w','q']); p['w']=p['w'].astype(str)
p['post']=pd.PeriodIndex(p.w,freq='W').start_time>=pd.Timestamp('2025-07-01'); p['T']=(p.grp=='T').astype(int)
p['TP']=p['T']*p['post'].astype(int); p['sold']=(p.q>0).astype(int)
print("so o panel:",len(p)," ty le o = 0:",(p.q==0).mean().round(3))
r=smf.ols('q ~ TP + C(sku) + C(w)',p).fit(cov_type='cluster',cov_kwds={'groups':p.sku})
print(f"San luong (muc, FE SKU+tuan): beta={r.params['TP']:.4f} se={r.bse['TP']:.4f} p={r.pvalues['TP']:.3f} | q trung binh nhom T truoc={p[(p['T']==1)&(~p.post)].q.mean():.3f}")
r2=smf.logit('sold ~ TP + C(grp) + C(w)',p).fit(disp=0)
print(f"Bien mo rong P(co ban trong tuan) logistic: beta={r2.params['TP']:.4f} se={r2.bse['TP']:.4f} p={r2.pvalues['TP']:.3f}")

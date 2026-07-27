import pandas as pd, numpy as np
c=pd.read_csv("chitiet.csv",low_memory=False); g=pd.read_csv("goc.csv",low_memory=False,dtype=str)
g['dg']=pd.to_datetime(g['ngayct']); g['store']=np.where(g.diachi_ban.str.startswith('08'),'cu','moi')
b=g[(g.ma_ncc_hddt=='THUE_BANRA')&(g.daxoa=='0')]
d=c.merge(b[['soid','dg','store']],on='soid',how='inner')
d=d[(d.dg>=pd.Timestamp('2025-02-01'))&(d.soluong_ct>0)&(d.sotien_sauvat_ct>0)]
bs=d.groupby(['soid','dg','store']).agg(SoMon=('ten_hh_ct','size'),TongTien=('sotien_sauvat_ct','sum')).reset_index()
piv=(d.pivot_table(index='soid',columns='type',values='soluong_ct',aggfunc='sum').fillna(0)>0).astype(int)
piv.columns=['NuocUong','SPKhac','DoAn']
X=bs.merge(piv,on='soid')
X['CuoiTuan']=(X.dg.dt.dayofweek>=5).astype(int)
X['SauChinhSach']=(X.dg>=pd.Timestamp('2025-07-01')).astype(int)
X['SoMon_b']=pd.cut(X.SoMon,[0,1,2,3,999],labels=['1','2','3','4+']).astype(str)
X['TongTien_b']=pd.qcut(X.TongTien,4,labels=['Q1','Q2','Q3','Q4']).astype(str)
V=X[['NuocUong','DoAn','SPKhac','SoMon_b','TongTien_b','CuaHang' ]] if False else X[['NuocUong','DoAn','SPKhac','SoMon_b','TongTien_b','store','CuoiTuan','SauChinhSach']]
V=V.rename(columns={'store':'CuaHang'}).astype(str)
print("n =",len(V)); print(V.head(3).to_string())
from pgmpy.estimators import PC, HillClimbSearch, BIC
print("\n=== PC (kiem dinh doc lap dieu kien, chi2, alpha=0.01) ===")
pc=PC(data=V); m=pc.estimate(ci_test='chi_square',significance_level=0.01,show_progress=False)
print("Canh:", sorted(m.edges()))
print("\n=== Hill-Climb + BIC ===")
hc=HillClimbSearch(data=V); m2=hc.estimate(scoring_method=BIC(V),show_progress=False)
print("Canh:", sorted(m2.edges()))

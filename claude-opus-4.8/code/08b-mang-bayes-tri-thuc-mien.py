import warnings; warnings.filterwarnings('ignore')
import pandas as pd, numpy as np
exec(open("bn.py",encoding="utf-8").read().split("from pgmpy")[0])
from pgmpy.estimators import PC, HillClimbSearch, BIC
print("\n########## BIEN THE 1: bo SoMon & TongTien (bien tong hop tat dinh) ##########")
V1=V.drop(columns=['SoMon_b','TongTien_b'])
print("PC :",sorted(PC(data=V1).estimate(ci_test='chi_square',significance_level=0.01,show_progress=False).edges()))
print("HC :",sorted(HillClimbSearch(data=V1).estimate(scoring_method=BIC(V1),show_progress=False).edges()))
print("\n########## BIEN THE 2: co tri thuc mien (cam chieu vo ly) ##########")
# cam: khong the co canh DI RA tu SoMon/TongTien; khong the co canh DI VAO CuaHang/CuoiTuan/SauChinhSach
nodes=list(V.columns); black=[]
for a in ['SoMon_b','TongTien_b']:
    for b_ in nodes:
        if a!=b_: black.append((a,b_))
for a in nodes:
    for b_ in ['CuaHang','CuoiTuan','SauChinhSach']:
        if a!=b_ and (a,b_) not in black: black.append((a,b_))
from pgmpy.causal_discovery import ExpertKnowledge
ek=ExpertKnowledge(forbidden_edges=black)
m=HillClimbSearch(data=V).estimate(scoring_method=BIC(V),expert_knowledge=ek,show_progress=False)
print("HC + tri thuc mien:",sorted(m.edges()))
print("\n########## Kiem tra tinh doc lap co dieu kien (nen tang ch.7) ##########")
from pgmpy.estimators.CITests import chi_square
for (x,y,z) in [('NuocUong','DoAn',[]),('NuocUong','DoAn',['TongTien_b']),('NuocUong','DoAn',['SoMon_b']),
                ('NuocUong','SPKhac',[]),('NuocUong','SPKhac',['SoMon_b'])]:
    st,p,_=chi_square(X=x,Y=y,Z=z,data=V,boolean=False,significance_level=0.01)
    print(f"  {x} _||_ {y} | {(','.join(z) if z else 'rong'):16s} -> chi2={st:10.1f}  p={p:.3g}")

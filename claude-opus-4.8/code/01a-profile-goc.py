import pandas as pd
pd.set_option("display.width",200)
g=pd.read_csv("goc.csv",dtype=str,low_memory=False)
c=pd.read_csv("chitiet.csv",dtype=str,low_memory=False)
print("GOC cols:", list(g.columns))
print()
for col in g.columns:
    nu=g[col].nunique(dropna=True)
    nn=g[col].notna().sum()
    print(f"{col:32s} nonnull={nn:7d} uniq={nu:7d} ex={list(g[col].dropna().unique()[:4])}"[:220])

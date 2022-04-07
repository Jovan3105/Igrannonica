import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import io
import urllib, base64
import textwrap

def get_stat_indicators(data):
    df = pd.DataFrame(data)

    cont_indexes = ["Count","Mean","Standard deviation","Minimum","25th ercentile","50th percentile","75th percentile","max"]
    cat_indexes = ["Count","Unique","Top","Frequency"]

    #columns with numeric values
    continuous = df.select_dtypes(include='number')

    print("######## continuous:")
    print(continuous)

    if len(continuous.columns) > 0:
        continuous_stat = continuous.describe().to_dict('records')
    else:
        continuous_stat = []

    print("######## continuous_stat:")
    print(continuous_stat)

    #columns with non-numeric values
    categorical = df.select_dtypes(exclude='number')
    
    if len(categorical.columns) > 0:
        categorical_stat = categorical.describe().to_dict('records')
    else:
        categorical_stat = []
    
    
    print("######## categorical_stat:")
    print(categorical_stat)

    cont_stat_response = []
    cat_stat_response = []
    
    i = 0
    for stat in continuous_stat:
        row = {"indicator":cont_indexes[i], **stat}
        cont_stat_response += [row]
        i += 1

    print(categorical_stat)
    i = 0
    for stat in categorical_stat:
        row = {"indicator":cat_indexes[i], **stat}
        cat_stat_response += [row]
        i += 1
    print(cat_stat_response)

    stat_indicators = {}

    stat_indicators["continuous"] = cont_stat_response
    stat_indicators["categorical"] = cat_stat_response

    return stat_indicators

def get_corr_matrix(data):
    df = pd.DataFrame(data)
    corr = df.corr()

    # creating mask
    #mask = np.triu(np.ones_like(df.corr()))
    #sns.heatmap(df.corr(method='pearson'), annot=True, cbar=False, mask=mask)
    #ax.set_yticklabels(ax.get_yticklabels(), rotation="horizontal")
    sns.set_theme(style="white")
    
    # Generate a mask for the upper triangle
    mask = np.triu(corr)

    np.fill_diagonal(mask, False)

    # Set up the matplotlib figure
    f, ax = plt.subplots(figsize=(12, 9))

    # Generate a custom diverging colormap
    cmap ="Spectral" #sns.diverging_palette(230, 20, as_cmap=True)

    # Draw the heatmap with the mask and correct aspect ratio
    heatmap = sns.heatmap(corr, mask=mask, cmap=cmap, center=0,
            square=True, linewidths=.5, cbar_kws={"shrink": 1}, fmt='.5f')

    sns.set(font_scale=0.5)
    buf = io.BytesIO()
    f.set_tight_layout(True)

    f.savefig(buf, format='png')
    buf.seek(0)
    string = base64.b64encode(buf.read())

    uri = 'data:image/png;base64,' + urllib.parse.quote(string)

    return uri

import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

from services.shared_service import figure_to_uri, log

#################################################################

CAT_INDEXES = ["Count","Unique","Top","Frequency"]
CONT_INDEXES = ["Count","Mean","Standard deviation","Minimum","25th percentile","50th percentile","75th percentile","Max"]

#################################################################

def get_stat_indicators(df):

    #columns with numeric values
    continuous = df.select_dtypes(include='number')

    log("continuous:")
    log(continuous)

    if len(continuous.columns) > 0:
        continuous_stat = continuous.describe().to_dict('records')
    else:
        continuous_stat = []

    log("continuous_stat:")
    log(continuous_stat)

    #columns with non-numeric values
    categorical = df.select_dtypes(exclude='number')
    
    if len(categorical.columns) > 0:
        categorical_stat = categorical.describe().to_dict('records')
    else:
        categorical_stat = []
    
    log("categorical_stat:")
    log(categorical_stat)

    cont_stat_response = []
    cat_stat_response = []
    
    i = 0
    for stat in continuous_stat:
        row = {"indicator":CONT_INDEXES[i], **stat}
        cont_stat_response += [row]
        i += 1

    log(categorical_stat)
    i = 0
    for stat in categorical_stat:
        row = {"indicator":CAT_INDEXES[i], **stat}
        cat_stat_response += [row]
        i += 1
    log(cat_stat_response)

    stat_indicators = {}

    stat_indicators["continuous"] = cont_stat_response
    stat_indicators["categorical"] = cat_stat_response

    return stat_indicators

# # #

def get_corr_matrix(df, diagonal=False):
    mask = None
    corr = df.corr()

    sns.set_theme(style="white")
    #sns.set(font_scale=0.5)
    
    if diagonal:
        # Generate a mask for the upper triangle
        mask = np.triu(corr)

        np.fill_diagonal(mask, False)

    # Set up the matplotlib figure
    figure, ax = plt.subplots(figsize=(12, 9))
    figure.set_tight_layout(True)

    # Generate a custom diverging colormap
    cmap = "Spectral" #sns.diverging_palette(230, 20, as_cmap=True)

    # Draw the heatmap with the mask and correct aspect ratio
    heatmap = sns.heatmap(corr, mask=mask, cmap=cmap, center=0, annot=True,
        square=True, linewidths=.5, cbar_kws={"shrink": 1}, fmt='.5f')

    uri = figure_to_uri(figure)

    return uri

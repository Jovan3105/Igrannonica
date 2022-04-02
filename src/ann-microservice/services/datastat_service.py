import numpy as np
import pandas as pd


def get_stat_indicators(df):
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
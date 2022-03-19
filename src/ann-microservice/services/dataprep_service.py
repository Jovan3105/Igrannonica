import numpy as np
import pandas as pd

def parse_dataset(
    filename,
    file, 
    delimiter=None, 
    parse_dates=None, 
    lineterminator=None, 
    quotechar='"', 
    escapechar=None, 
    encoding=None
    ):

    if(filename.lower().endswith('.csv')):
        df = pd.read_csv(
            file, 
            delimiter=delimiter, 
            index_col=0, 
            lineterminator=lineterminator, 
            quotechar=quotechar,
            escapechar=escapechar, 
            encoding=encoding
            )

        column_types = [ (name,str(dtype)) for name, dtype in df.dtypes.iteritems() ]
        df_json = df.to_json()

    return df_json, column_types
    
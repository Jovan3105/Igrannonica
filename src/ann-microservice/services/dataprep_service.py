import json
import numpy as np
import pandas as pd

from pydantic import AnyHttpUrl
from starlette.datastructures import UploadFile

from models import models
from services.shared_service import log

#################################################################

QUOTE_NONNUMERIC = 2

#################################################################

def parse_dataset(
    dataset_source, 
    delimiter=None, 
    lineterminator=None, 
    quotechar='"', 
    escapechar=None, 
    encoding=None
    ):
    
    df = None
    
    is_url = isinstance(dataset_source, AnyHttpUrl)
    is_file = isinstance(dataset_source, UploadFile)

    # assume datasource is a link
    fname = dataset_source

    if is_file:
        fname = dataset_source.filename

    fname = fname.lower()

    if( fname.endswith('.csv') ):
        log("Given dataset appears to be .csv file")

        if is_file:
            dataset_source = dataset_source.file

        df = pd.read_csv(
            dataset_source, 
            delimiter        = delimiter, 
            lineterminator   = lineterminator, 
            quotechar        = quotechar,
            escapechar       = escapechar, 
            encoding         = encoding,
            index_col        = None, 
            on_bad_lines     = 'warn',
            skipinitialspace = True
            )
            
        #df = df.fillna(np.NaN) # TODO proveriti
        df = df.astype(object).replace(np.nan, None)

        log('Parsing completed.')

    return df

# # #

def get_basic_info(df):
    missingValuesEntireDF = int(df.isnull().sum().sum()) #df.value_counts()["NaN"]
    nrows, ncols = df.shape

    return { "rowNum" : nrows, "colNum" : ncols, "missing" : missingValuesEntireDF }

# # #

def get_column_types(df):
    return [ {name : str(dtype) } for name, dtype in df.dtypes.iteritems() ]

# # #

def modify_dataset(dataset, data:models.ModifiedData):
    df = pd.DataFrame(dataset['parsedDataset'])
    try:
        for editRow in data.edited:
            if (df.dtypes[editRow.col] == "int64"):
                df.iloc[editRow.row, editRow.col] = int(editRow.value)
            elif (df.dtypes[editRow.col] == "float64"):
                df.iloc[editRow.row, editRow.col] = float(editRow.value)
            else:
                df.iloc[editRow.row, editRow.col] = editRow.value
            
        df.drop(data.deletedRows, inplace=True)
    
        df.drop(df.columns[data.deletedCols],axis=1,inplace=True)

    except:
        return 'error'
    

    dataset['parsedDataset'] = json.loads(df.to_json(orient="records"))  # TODO proveriti da li moze da se odradi jednostavnije
    dataset['basicInfo'] = get_basic_info(df)

    return dataset

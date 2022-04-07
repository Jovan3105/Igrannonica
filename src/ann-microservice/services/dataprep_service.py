import numpy as np
import pandas as pd
#from chardet.universaldetector import UniversalDetector # for future revision
import logging
from pydantic import AnyHttpUrl
from starlette.datastructures import UploadFile
from models import models
import json
import os

logger = logging.getLogger()

#if dev_mode:
logger.setLevel(logging.DEBUG)


encoding_first_n_lines = 50
QUOTE_NONNUMERIC = 2

def read_json_data(json_file):
    return json.load(json_file) 

def parse_dataset(
    dataset_source, 
    delimiter=None, 
    lineterminator=None, 
    quotechar='"', 
    escapechar=None, 
    encoding=None
    ):
    
    # for future revision
    #
    #if encoding == None or encoding == "auto":
    #    encoding = get_encoding(file.read(), encoding_first_n_lines)
    #    print('Log: assume encoding is {}'.format(encoding))

    df_dict = None
    column_types = None
    basic_info = None
    
    is_url = isinstance(dataset_source, AnyHttpUrl)
    is_file = isinstance(dataset_source, UploadFile)
    df = None

    # assume datasource is a link
    fname = dataset_source

    if is_file:
        fname = dataset_source.filename

    fname = fname.lower()

    if( fname.endswith('.csv') ):
        print("####:     Given dataset appears to be .csv file")

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
        df = df.fillna('') # TODO proveriti

        column_types = [ {name : str(dtype) } for name, dtype in df.dtypes.iteritems() ]

        missingValuesEntireDF = int(df.isnull().sum().sum())
        nrows, ncols = df.shape
        basic_info = { "rowNum" : nrows, "colNum" : ncols, "missing" : missingValuesEntireDF }
        
        df_dict = df.to_dict('records')

        print('####:     Parsing complete.')

    return df, df_dict, column_types, basic_info
    

def get_encoding(file, n_lines=50):
    detector = UniversalDetector()
    detector.reset()

    for i, row in enumerate(file):
        detector.feed(row)
        if i >= n_lines-1 or detector.done: 
            break

    detector.close()

    print("####:     detected encoding is {}. Detection confidence is {}".format(
        detector.result['encoding'],
        detector.result['confidence']))

    return detector.result['encoding']


def modify(
    dataset, 
    modifiedData:models.ModifiedData):

    parsedData = dataset['parsedDataset']

    df = pd.json_normalize(parsedData)

    for edit in modifiedData.edited:
        df.iloc[edit.row,edit.col] = edit.value
    
    for delete in modifiedData.deleted:
        df.drop(delete,inplace=True)
    

    missingValuesEntireDF = int(df.isnull().sum().sum())
    nrows, ncols = df.shape
    basic_info = { "rowNum" : nrows, "colNum" : ncols, "missing" : missingValuesEntireDF }
    
    dataset['parsedDataset'] = json.loads(df.to_json(orient="records"))
    dataset['basicInfo'] = basic_info

    return dataset


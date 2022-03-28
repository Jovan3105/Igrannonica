import numpy as np
import pandas as pd
#from chardet.universaldetector import UniversalDetector # for future revision
import logging

logger = logging.getLogger()

#if dev_mode:
logger.setLevel(logging.DEBUG)


encoding_first_n_lines = 50
QUOTE_NONNUMERIC = 2

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

    if(dataset_source.lower().endswith('.csv')):
        print("####:     Given dataset appears to be .csv file")
        df = pd.read_csv(
            dataset_source, 
            delimiter        = delimiter, 
            lineterminator   = lineterminator, 
            quotechar        = quotechar,
            escapechar       = escapechar, 
            encoding         = encoding,
            index_col        = 0, 
            on_bad_lines     = 'warn',
            skipinitialspace = True
            )

        column_types = [ {name : str(dtype) } for name, dtype in df.dtypes.iteritems() ]
        df.reset_index(inplace=True)

        missingValuesEntireDF = int(df.isnull().sum().sum())
        nrows, ncols = df.shape
        basic_info = { "rowNum" : nrows, "colNum" : ncols, "missing" : missingValuesEntireDF }
        
        df_dict = df.to_dict('records')

        print('####:     Parsing complete.')

    return df_dict, column_types, basic_info
    

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
import numpy as np
import pandas as pd
#from chardet.universaldetector import UniversalDetector # for future revision

encoding_first_n_lines = 50


def parse_dataset(
    file, 
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

    if(file.filename.lower().endswith('.csv')):
        df = pd.read_csv(
            file, 
            delimiter        = delimiter, 
            lineterminator   = lineterminator, 
            quotechar        = quotechar,
            escapechar       = escapechar, 
            encoding         = encoding,
            index_col        = 0, 
            on_bad_lines     = 'warn',
            skipinitialspace = True
            )

        column_types = [ (name,str(dtype)) for name, dtype in df.dtypes.iteritems() ]

        df.reset_index(inplace=True)

        df_dict = df.to_dict('records')

    return df_dict, column_types
    

def get_encoding(file, n_lines=50):
    detector = UniversalDetector()
    detector.reset()

    for i, row in enumerate(file):
        detector.feed(row)
        if i >= n_lines-1 or detector.done: 
            break

    detector.close()

    print("Log: detected encoding is {}. Detection confidence is {}".format(
        detector.result['encoding'],
        detector.result['confidence']))

    return detector.result['encoding']
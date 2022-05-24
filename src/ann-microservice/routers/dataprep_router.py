from fastapi import APIRouter, UploadFile, File
from typing import List, Optional
from pydantic import AnyHttpUrl

from models.models import ModifiedData, ColumnFillMethodPair
from services.shared_service import read_json_data
from services.dataprep_service import parse_dataset, get_column_types, get_basic_info, modify_dataset, fill_missing

#################################################################

router = APIRouter(prefix="/data-preparation")

#################################################################

@router.get("/parse")
async def get_parsed_dataset(
    dataset_source : AnyHttpUrl,
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    quotechar      : Optional[str] = None,
    escapechar     : Optional[str] = None,
    encoding       : Optional[str] = None,
    ):
    '''
    Parsira dataset koji se nalazi na prosleđenom linku **dataset_source**. 

    '''

    df, column_types   = parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    parsed_dataset = df.to_dict('records')
    basic_info = get_basic_info(df)

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types, "basicInfo" : basic_info}

# # #

@router.post("/parse-file")
async def parse_dataset_file(
    dataset_source : UploadFile = File(...),
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    quotechar      : Optional[str] = None,
    escapechar     : Optional[str] = None,
    encoding       : Optional[str] = None,
    ):
    '''
    Parsira dataset **dataset_source** koji je upload-ovan.

    '''
    df, column_types  = parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    parsed_dataset = df.to_dict('records')
    basic_info = get_basic_info(df)

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types, "basicInfo" : basic_info}

# # #

@router.put("/modify")
async def modify(stored_dataset : AnyHttpUrl, modified_data : ModifiedData):
    '''
    Na osnovu liste akcija vrsi izmenu vrednosti, brisanje reda ili kolone u prosledjenom fajlu
    '''

    dataset = read_json_data(stored_dataset)
    msg = modify_dataset(dataset, modified_data)

    return msg


# # #

@router.put("/fill-missing")
async def fill_missing_values(
    stored_dataset           : AnyHttpUrl, 
    column_fill_method_pairs : List[ColumnFillMethodPair]
    ):
    '''
    Popunjava prazna polja u dataset-u koristeci odabrani metod
    '''

    dataset = read_json_data(stored_dataset)
    fill_missing(dataset, column_fill_method_pairs)

    return dataset
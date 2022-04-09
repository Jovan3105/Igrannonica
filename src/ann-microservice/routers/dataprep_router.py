from fastapi import APIRouter, UploadFile, File
from typing import Optional
from pydantic import AnyHttpUrl

from models import models
from services.dataprep_service import parse_dataset, get_column_types, get_basic_info, modify

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

    df  = parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    parse_dataset = df.to_dict('records')
    column_types = get_column_types(df)
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
    df  = parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    parse_dataset = df.to_dict('records')
    column_types = get_column_types(df)
    basic_info = get_basic_info(df)

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types, "basicInfo" : basic_info}

# # #

@router.put("/modify")
async def modify(path:str, data : models.ModifiedData):
    '''
    Na osnovu liste akcija vrsi izmenu vrednosti, brisanje reda ili kolone u prosledjenom fajlu
    '''
    msg = modify_dataset(path, data)
    
    return msg



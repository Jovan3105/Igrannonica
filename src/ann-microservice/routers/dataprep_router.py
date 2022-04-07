from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional
from pydantic import BaseModel, AnyHttpUrl
from services import dataprep_service
from models import models

#################################################################

router = APIRouter(prefix="/data-preparation")

#################################################################

@router.get("/parse")
async def parse_dataset(
    dataset_source : AnyHttpUrl,
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    quotechar      : Optional[str] = None,
    escapechar     : Optional[str] = None,
    encoding       : Optional[str] = None,
):
    '''
    Parsira dataset koji se nalazi na prosleđenoj lokaciji **dataset_source**

    '''

    ( df, parsed_dataset, column_types, basic_info ) = dataprep_service.parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types, "basicInfo" : basic_info }


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
    Parsira dataset koji je upload-ovan

    '''
    print("#"*30)
    ( _, parsed_dataset, column_types, basic_info ) = dataprep_service.parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types, "basicInfo" : basic_info }


@router.put("/modify")
async def modify(
    modifiedData : models.ModifiedData,
    dataset_source : UploadFile = File(...)
    ):
    
    json_data = read_json_data(dataset_source.file)

    msg = dataprep_service.modify(json_data['parsedDataset'], modifiedData)

    return msg


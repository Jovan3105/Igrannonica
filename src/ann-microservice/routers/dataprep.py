from fastapi import APIRouter, HTTPException, Path, Query
from typing import Optional
from pydantic import BaseModel, AnyHttpUrl
from services import dataprep_service

#################################################################

router = APIRouter(prefix="/data-preparation")

#################################################################

@router.get("/parse")
async def parse_dataset(
    dataset_source : AnyHttpUrl= Query(None, title='Dataset Source', description='Lokacija resursa'),
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    quotechar      : Optional[str] = None,
    escapechar     : Optional[str] = None,
    encoding       : Optional[str] = None,
):
    '''
    Parsira dataset koji se nalazi na prosleđenoj lokaciji **dataset_source**

    '''

    ( parsed_dataset, column_types ) = dataprep_service.parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )

    return {'parsedDataset' : parsed_dataset, "columnTypes" : column_types }, 200  

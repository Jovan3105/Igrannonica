from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import BaseModel, AnyHttpUrl
from typing import Optional
import pandas as pd

from services import dataprep_service
from services import datastat_service

#################################################################

router = APIRouter(prefix="/dataset")

#################################################################

@router.get("/stat_indicators")
async def get_stat_indicators(
    dataset_source : AnyHttpUrl,
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    quotechar      : Optional[str] = None,
    escapechar     : Optional[str] = None,
    encoding       : Optional[str] = None,
):

    df, _, _, _ = dataprep_service.parse_dataset(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        quotechar = '"' if quotechar == None else quotechar, 
        escapechar = escapechar, 
        encoding = encoding 
        )
    
    print(f"####:     Dataset:")
    print(df)

    return datastat_service.get_stat_indicators(df)
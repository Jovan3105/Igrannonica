from xml.etree.ElementInclude import include
from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import BaseModel, AnyHttpUrl
from typing import Optional
import pandas as pd

from services import datastatistics_service

#################################################################

router = APIRouter(prefix="/dataset")

#################################################################

@router.get("/stat_indicators")
async def get_stat_indicators(
    dataset_source : AnyHttpUrl,
    delimiter      : Optional[str] = None,
    lineterminator : Optional[str] = None,
    encoding       : Optional[str] = None,
):

    ( dataset, column_types, basic_info ) = datastatistics_service.get_stat_indicators(
        dataset_source,
        delimiter = delimiter, 
        lineterminator = lineterminator, 
        encoding = encoding 
        )
    
    dataset = pd.DataFrame.from_dict(dataset)

    #columns with numeric values
    continuous = dataset.select_dtypes(include='number')
    continuous = continuous.describe().T.to_dict('records')

    #columns with non-numeric values
    categorical = dataset.select_dtypes(include='object')
    categorical = categorical.describe().T.to_dict('records')

    newDict = {}
    newDict["continuous"] = continuous
    newDict["categorical"] = categorical

    return newDict
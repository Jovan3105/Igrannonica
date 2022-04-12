import pandas as pd
from fastapi import APIRouter
from pydantic import AnyHttpUrl

from services.datastat_service import get_corr_matrix, get_stat_indicators
from services.shared_service import read_json_data


#################################################################

router = APIRouter(prefix="/dataset")

#################################################################

@router.get("/stat-indicators")
async def get_statistical_indicators(stored_dataset : AnyHttpUrl):
    dataset = read_json_data(stored_dataset)
    df = pd.DataFrame(dataset['parsedDataset'])

    return get_stat_indicators(df)

# # #

@router.get("/corr-matrix")
async def get_correlation_matrix(stored_dataset : AnyHttpUrl):
    dataset = read_json_data(stored_dataset)
    df = pd.DataFrame(dataset['parsedDataset'])

    return get_corr_matrix(df)
    
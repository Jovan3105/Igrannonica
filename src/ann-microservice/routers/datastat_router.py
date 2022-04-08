from fastapi import APIRouter, UploadFile, File

from services.datastat_service import get_corr_matrix, get_stat_indicators
from services.shared_service import stored_dataset_to_dataframe

#################################################################

router = APIRouter(prefix="/dataset")

#################################################################

@router.post("/stat_indicators")
async def get_statistical_indicators(stored_dataset : UploadFile = File(...)):
    df = stored_dataset_to_dataframe(stored_dataset)

    return get_stat_indicators(df)

# # #

@router.post("/corr_matrix")
async def get_correlation_matrix(stored_dataset : UploadFile = File(...)):
    df = stored_dataset_to_dataframe(stored_dataset)
    
    return get_corr_matrix(df)
    
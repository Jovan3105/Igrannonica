from fastapi import APIRouter, UploadFile, File

from services.datastat_service import get_corr_matrix, get_stat_indicators

#################################################################

router = APIRouter(prefix="/dataset")

#################################################################

@router.post("/stat_indicators")
async def get_statistical_indicators(dataset_source : UploadFile = File(...)):
    df = stored_dataset_to_dataframe(dataset_source)

    return get_stat_indicators(df)

# # #

@router.post("/corr_matrix")
async def get_correlation_matrix(dataset_source : UploadFile = File(...)):
    df = stored_dataset_to_dataframe(dataset_source)
    
    return get_corr_matrix(df)
    
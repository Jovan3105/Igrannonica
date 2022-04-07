from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional
from pydantic import BaseModel, AnyHttpUrl

import pandas as pd
import json
import os
from io import StringIO


from services.dataprep_service import read_json_data
from services.datastat_service import get_corr_matrix, get_stat_indicators

#################################################################

router = APIRouter(prefix="/dataset")

#################################################################

@router.post("/stat_indicators")
async def get_statistical_indicators(
    dataset_source : UploadFile = File(...)
):
    #print(dataset_source,type(dataset_source))
    json_data = read_json_data(dataset_source.file)

    return get_stat_indicators(json_data['parsedDataset'])

@router.post("/corr_matrix")
async def get_correlation_matrix(
    dataset_source : UploadFile = File(...)
):
    json_data = read_json_data(dataset_source.file)
    #print(json_data,type(dataset_source))
    
    return get_corr_matrix(json_data['parsedDataset'])
    
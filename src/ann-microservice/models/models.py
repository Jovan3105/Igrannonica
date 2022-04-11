from pydantic import BaseModel
from typing import List

class Cell(BaseModel):
    row:int
    col:int
    value:str

class ModifiedData(BaseModel):
    edited: List[Cell]
    deletedRows: List[int]
    deletedCols:List[int]
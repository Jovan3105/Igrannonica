from pydantic import BaseModel
from typing import List

class Cell(BaseModel):
    row:int
    col:int
    value:str

class ModifiedData(BaseModel):
    id: int
    edited: List[Cell]
    deleted: List[int]
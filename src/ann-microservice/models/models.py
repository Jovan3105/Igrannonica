
from typing import List
from pydantic import BaseModel
from helpers.activation_func_helper import ActivationFunction
from helpers.weight_init_helper import WeightInitializer

#################################################################

class Cell(BaseModel):
    row:int
    col:int
    value:str

# # #
class ModifiedData(BaseModel):
    id: int
    edited: List[Cell]
    deleted: List[int]

# # #

class NNLayer(BaseModel):
    index:int
    units:int
    weight_initializer:WeightInitializer
    activation_function:ActivationFunction

    class Config:  
        use_enum_values = True
from fastapi import APIRouter, Query
from typing import Optional, List
from pydantic import AnyHttpUrl
from services import dataprep_service
from services.training_service import train_model
 
#################################################################

backend_base_addr = 'localhost:7220'
uri = f'ws://{backend_base_addr}/ws'
print_prefix = "####:     "

router = APIRouter(prefix="/training")


#################################################################

@router.get("/")
async def training(
    dataset_source   : AnyHttpUrl,
    features         : List[str] = Query(...),
    labels           : List[str] = Query(...),
    delimiter        : Optional[str] = None,
    lineterminator   : Optional[str] = None,
    quotechar        : Optional[str] = None,
    escapechar       : Optional[str] = None,
    encoding         : Optional[str] = None,
    learning_rate    : Optional[float] = 0.1,
    loss_function    : Optional[str] = 'mean_absolute_error',
    testing_split    : Optional[float] = 0.8,
    validation_split : Optional[float] = 0.2,
    epochs           : Optional[int] = 100,
    optimizer_key        : Optional[str] = 'adam',
):
    ( df, _, _, _ ) = dataprep_service.parse_dataset(
            dataset_source,
            delimiter = delimiter, 
            lineterminator = lineterminator, 
            quotechar = '"' if quotechar == None else quotechar, 
            escapechar = escapechar, 
            encoding = encoding 
            )
    
    print(print_prefix+f"Passed as features={features}; passed as labels={labels}")

    model = train_model(
        df,
        features,
        labels,
        learning_rate,
        loss_function,
        testing_split,
        validation_split,
        epochs,
        optimizer_key )

    return "trening je zavrsen"

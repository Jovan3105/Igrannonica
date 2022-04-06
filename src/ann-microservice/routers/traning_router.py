from fastapi import APIRouter, Query
from typing import Optional, List
from pydantic import AnyHttpUrl, BaseModel

from services import dataprep_service
from services.training_service import train_model
from helpers.optimizer_helper import Optimizer
from helpers.loss_func_helper import LossFunction
from helpers.metric_helper import Metric
from services.shared_service import log

from tensorflow.keras.optimizers import Optimizer as tfOptimizer
 
#################################################################

router = APIRouter(prefix="/training")

#################################################################

@router.get("/")
async def training(
    dataset_source   : AnyHttpUrl,
    features         : List[str] = Query(...),
    labels           : List[str] = Query(...),
    metrics          : List[Metric] = Query(...),
    delimiter        : Optional[str] = None,
    lineterminator   : Optional[str] = None,
    quotechar        : Optional[str] = None,
    escapechar       : Optional[str] = None,
    encoding         : Optional[str] = None,
    loss_function    : Optional[LossFunction] = LossFunction.MeanAbsoluteError,
    test_size        : Optional[float] = 0.8,
    validation_size  : Optional[float] = 0.2,
    epochs           : Optional[int] = 100,
    optimizer        : Optional[Optimizer] = Optimizer.Adam,
    learning_rate    : Optional[float] = 0.1
):
    ( df, _, _, _ ) = dataprep_service.parse_dataset(
            dataset_source,
            delimiter = delimiter, 
            lineterminator = lineterminator, 
            quotechar = '"' if quotechar == None else quotechar, 
            escapechar = escapechar, 
            encoding = encoding 
            )
    
    log(f"Feature list={features}; Label list={labels}; Metric list={metrics}")

    true, pred = train_model(
        df,
        features,
        labels,
        metrics,
        learning_rate,
        loss_function,
        test_size,
        validation_size,
        epochs,
        optimizer )

    return { "true-pred" : dict(zip([x[0] for x in true], [x[0] for x in pred])) }

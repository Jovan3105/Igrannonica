from fastapi import APIRouter, HTTPException, Body
from typing import Optional, List
from pydantic import AnyHttpUrl


from models.models import NNLayer
from services.training_service import train_model
from helpers.optimizer_helper import Optimizer
from helpers.loss_func_helper import LossFunction
from helpers.metric_helper import Metric
from services.shared_service import log, read_json_data

#################################################################

router = APIRouter(prefix="/training")
REGRESSION_METRICS = [
    Metric.LogCoshError, Metric.MeanAbsoluteError, Metric.MeanAbsolutePercentageError, Metric.MeanSquaredError, 
    Metric.MeanSquaredLogarithmicError, Metric.Poisson, Metric.RootMeanSquaredError,
    Metric.Mean, # TODO proveriti
    Metric.Sum   # TODO proveriti
    ]

#################################################################

@router.post("")
async def begin_training(
    stored_dataset   : AnyHttpUrl = Body(...),
    problem_type     : str = Body(...),
    layers           : List[NNLayer] = Body(...),
    features         : List[str] = Body(...),
    labels           : List[str] = Body(...),
    metrics          : List[Metric] = Body(...),
    loss_function    : LossFunction = Body(LossFunction.MeanAbsoluteError),
    test_size        : float = Body(0.8),
    validation_size  : float = Body(0.2),
    epochs           : int = Body(100),
    optimizer        : Optimizer = Body(Optimizer.Adam),
    learning_rate    : float = Body(0.1)
    ):
    
    log(f"Feature list={features}; Label list={labels}; Metric list={metrics}")

    dataset = read_json_data(stored_dataset)
    df = pd.DataFrame(dataset['parsedDataset'])
    
    dataset_headers = list(cont_cols_set | cat_cols_set)

    # Validate problem type #

    if problem_type not in ['classification', 'regression']:
        raise HTTPException(status_code=400, detail=f"Invalid problem type: {problem_type}")

    # Validate feature and label lists #

    for feature in features:
        if feature not in dataset_headers:
            raise HTTPException(status_code=400, detail=f"Invalid feature: {feature}")
        
    for label in labels:
        if label not in dataset_headers:
            raise HTTPException(status_code=400, detail=f"Invalid label: {label}")

    # Validate metric list #
    problem_is_regression = problem_type == 'regression'
    problem_is_classification = problem_type == 'classification'
    invalid_choices = []

    for metric in metrics:
        if problem_is_regression:
            if not metric in REGRESSION_METRICS:
                invalid_choices.append(metric)
        elif metric in REGRESSION_METRICS:
            invalid_choices.append(metric)

    if len(invalid_choices) > 0:
        raise HTTPException(status_code=400, 
            detail=f"One or more metric does not match it's problem type (choosen problem type:'{problem_type}'). Invalid metrics:{invalid_choices}")

    # begin training #
    
    true, pred = train_model(
        df,
        features,
        labels,
        layers,
        metrics,
        learning_rate,
        loss_function,
        test_size,
        validation_size,
        epochs,
        optimizer,
        dataset_headers,
        cont_cols_set, 
        cat_cols_set
        )

    return { "true-pred" : dict(zip([x[0] for x in true], [x[0] for x in pred])) }

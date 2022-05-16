import numpy as np
import pandas as pd
import tensorflow as tf

from tensorflow import keras
from fastapi import HTTPException
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.model_selection import train_test_split

from models.models import NNLayer, Column
from services.shared_service import log, send_msg, run_async
from helpers.weight_init_helper import map_weight_init
from helpers.metric_helper import map_metrics, Metric
from helpers.optimizer_helper import map_optimizer, Optimizer
from helpers.activation_func_helper import map_activation_function, ActivationFunction
from helpers.loss_func_helper import map_loss_function, LossFunction
from helpers.encoder_helper import map_catcolencoder, CatColEncoder

#################################################################

def make_encoder_col_dict(features: Column, labels: Column, cont_features: [str]):
    encoders = {}

    for feature in features:
        if not feature.name in cont_features:
            if not feature.encoder in encoders:
                encoders[feature.encoder] = [feature.name]
            else:
                encoders[feature.encoder] += [feature.name]

    # for label in labels:
            # if not label.encoder in encoders:
            #     encoders[label.encoder] = [label.name]
            # else:
            #     encoders[label.encoder] += [label.name]

    return encoders

# # #

def encode_and_scale(cont_features: [str], encoders_cols_dict: {str}, X_train, X_test):
    
    if not 'OneHot' in encoders_cols_dict:
        encoders_cols_dict['OneHot'] = []
        
    if not 'Ordinal' in encoders_cols_dict:
        encoders_cols_dict['Ordinal'] = []
        
    if not 'Label' in encoders_cols_dict:
        encoders_cols_dict['Label'] = []

    col_trans = make_column_transformer(
        (MinMaxScaler(), cont_features),
        (map_catcolencoder(CatColEncoder.OneHot), encoders_cols_dict['OneHot'])
    )

    col_trans.fit(X_train)

    return col_trans.transform(X_train), col_trans.transform(X_test), col_trans

# # #

def create_layer_array(nnlayers: NNLayer, problem_type: str, features: [str]):
    layers = []

    nnlayers.sort(key=lambda nn_layer: nn_layer.index)

    # Add feature layer and hidden layers #

    for layer in nnlayers:
        if layer.units <= 0:
            raise HTTPException(status_code=400, 
                detail=f"Invalid propery value for layer ({layer.index}). Number of units has to be greater then 0")
        
        layers.append(
            keras.layers.Dense(
            units=layer.units, 
            activation=map_activation_function(layer.activation_function), 
            kernel_initializer=map_weight_init(layer.weight_initializer)
            ))

    # Add output layer # TODO

    output_layer_activation_func = ActivationFunction.Linear
    
    if problem_type == 'classification':
        output_layer_activation_func = ActivationFunction.Softmax

    layers.append(
        keras.layers.Dense(
            units=1, # TODO layer.units, 
            activation=map_activation_function(output_layer_activation_func), 
            kernel_initializer=map_weight_init(layer.weight_initializer)
            ))

    return layers

#################################################################
# Main code

def train_model(
    df              : pd.DataFrame,
    problem_type    : str,
    features        : [Column],
    labels          : [Column],
    layers          : [NNLayer],
    metrics         : [Metric],
    learning_rate   : float,
    loss_function   : LossFunction,
    test_size       : float,
    validation_size : float,
    epochs          : int,
    optimizer       : Optimizer,
    dataset_headers : [str],
    cont_cols_set   : set, 
    cat_cols_set    : set,
    client_conn_id  : str
    ):
    
    log(f"features: {features}")
    log(f"labels: {labels}")

    cont_features = list(set([feature.name for feature in features ]) & cont_cols_set)

    # cont_features = list(set(features) & cont_cols_set)
    # cat_features = [] #list(set(features) & cat_cols_set)

    #cont_labels = list(set(labels) & cont_cols_set)
    #cat_labels = list(set(labels) & cat_cols_set)

    log(f"cont_features = {cont_features} "#| cat_features = {cat_features} " 
    #    + f"| cont_labels = {cont_labels} | cat_labels = {cat_labels}"
        )

    # Get dict with list of cols to encode with specific encoder
    encoders_cols_dict = make_encoder_col_dict(features, labels, cont_features)
    log(f"encoders_cols_dict: {encoders_cols_dict}")

    # Make a list of strings from Column lists #
    
    features = [ feature.name for feature in features ]
    labels   = [ label.name for label in labels ]

    # Prepare dataframe
    #df = df.dropna()

    # Separate labels from features
    X = df[features].copy()
    y = df[labels].copy()
    
    log("X")
    print(X)

    log("y")
    print(y)

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)

    # Scale (normalize) numerical and encode categorical data
    X_train_normal, X_test_normal, ct = encode_and_scale(cont_features, encoders_cols_dict, X_train, X_test)
    
    # Make a model #

    layers = create_layer_array(layers, problem_type, features)
    model = tf.keras.Sequential(layers)

    #model.summary()

    # Map optimizer key-code to actual tf optimizer     
    optimizer = map_optimizer(optimizer, learning_rate)

    # Map loss function key-code to actual tf loss function     
    loss_function = map_loss_function(loss_function)

    # Map metric key-code list to actual tf merics
    metrics = map_metrics(metrics)

    # Configure the model 
    model.compile(
        optimizer=optimizer,
        loss=loss_function,
        metrics=metrics
    )

    callback = CustomCallback()
    callback.init(client_conn_id)

    log("X_train_normal")
    print(X_train_normal)

    log("X_test")
    print(X_test)

    log("y_train")
    print(y_train)

    # Train the model
    history = model.fit(
        X_train_normal,
        y_train,
        epochs=epochs,
        # Suppress logging.
        verbose=1,
        # Calculate validation results on x% of the training data.
        validation_split=validation_size,
        callbacks=[callback]
    )

    #plot_loss(history, y_train[0], train_labels[0].min(), y_train[0].max())

    y_pred = model.predict(X_train_normal)

    score = model.evaluate(X_test_normal, y_test)

    log(f'Test loss: {score[0]}') 
    log(f'Test accuracy: {score[1]}')

    return y_test.values.tolist(), y_pred.tolist()


#################################################################
### Callbacks

# u ovom callback-u ce se vrsiti komunikacija preko socket-a
class CustomCallback(keras.callbacks.Callback):

    def init(self, client_conn_id):
        self.client_conn_id = client_conn_id

    def on_epoch_end(self, epoch, logs=None):
        epoch += 1 # increase for 1 because it is 0-based
        keys = list(logs.keys())
        log(f"\nEnd epoch {epoch} of training; got log keys: {keys}")

        epoch_report = {"epoch" : epoch}
        for key in keys:
            epoch_report[key] = logs[key]
            
        run_async( send_msg, self.client_conn_id, epoch_report)
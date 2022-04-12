import numpy as np
import pandas as pd
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.model_selection import train_test_split

from models.models import NNLayer
from services.shared_service import log
from helpers.optimizer_helper import map_optimizer
from helpers.loss_func_helper import map_loss_function
from helpers.metric_helper import map_metrics

#################################################################

def encode_and_scale(cont_features, cat_features, X_train, X_test):
    
    col_trans = make_column_transformer(
        (MinMaxScaler(), cont_features),
        (OneHotEncoder(handle_unknown='ignore'), cat_features)
    )

    col_trans.fit(X_train)

    return col_trans.transform(X_train), col_trans.transform(X_test), col_trans

# # #

def plot_history(history, label, min, max):
  plt.plot(history.history['loss'], label='loss')
  plt.plot(history.history[label], label=label)
  plt.ylim([min - 0.1, max + 0.1])
  plt.xlabel('Epoch')
  plt.ylabel(f'Error [{label}]')
  plt.legend()
  plt.grid(True)

  return plot

# # #

def create_layer_array(nnlayers: NNLayer):
    layers = []



    return layers

#################################################################
# Main code

def train_model(
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
    ):
    
    cont_features = list(set(features) & cont_cols_set)
    cat_features = list(set(features) & cat_cols_set)

    cont_labels = list(set(labels) & cont_cols_set)
    cat_labels = list(set(labels) & cat_cols_set)

    log( "[cont_features], [cat_features], [cont_labels], [cat_labels] ==="
        + f" {cont_features} {cat_features} {cont_labels} {cat_labels}")

    # Prepare dataframe
    df = df.dropna()
    #df = encode_and_scale(df)

    # Separate labels from features
    X = df[features].copy()
    y = df[labels].copy()
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)

    # Scale (normalize) numerical and encode categorical data
    X_train_normal, X_test_normal, ct = encode_and_scale(cont_features, cat_features, X_train, X_test)
    
    # Make a model
    model = tf.keras.Sequential([
        layers.Dense(units=128, activation='relu'),
        layers.Dense(units=32, activation='relu'),
        layers.Dense(units=1, activation='linear')
    ])

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

    log(X_train_normal)

    log(y_train)

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

    log('Test loss:', score[0]) 
    log('Test accuracy:', score[1])

    return y_test.values.tolist(), y_pred.tolist()


#################################################################
### Callbacks

# u ovom callback-u ce se vrsiti komunikacija preko socket-a
class CustomCallback(keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        keys = list(logs.keys())
        log("\nEnd epoch {} of training; got log keys: {}".format(epoch, keys))

        metric_info = ""
        for key in keys:
            metric_info += f" ({key}:{logs[key]})"
            
        log( f"{epoch} {metric_info}")



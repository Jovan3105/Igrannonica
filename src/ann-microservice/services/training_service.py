import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from fastapi import HTTPException
from services import shared_service

#################################################################

print_prefix = "####:     "

#################################################################

def encode_cat_data(df):
    return pd.get_dummies(df)

def train_test_split(df):
    train_dataset = df.sample(frac=testing_split, random_state=0)
    test_dataset = df.drop(train_dataset.index)

    return train_dataset, test_dataset

def plot_loss(history, label, min, max):
  plt.plot(history.history['loss'], label='loss')
  plt.plot(history.history[label], label=label)
  plt.ylim([min, max])
  plt.xlabel('Epoch')
  plt.ylabel(f'Error [{label}]')
  plt.legend()
  plt.grid(True)

  return plot

def generate_img_from_plt(epoch, logs={}):
    print(f"Model: {self.model}")

    #return image_to_uri(plt) # TODO image ext detection/check


def _on_epoch_end(epoch, logs={}):
    return epoch, self.y_true.numpy(),  self.y_pred.numpy()

 
def map_optimizer(optimizer_key, learning_rate):   
    optimizer_switcher = {
        'adam' : tf.optimizers.Adam(learning_rate=learning_rate)
    }

    try:         
        return optimizer_switcher.get(optimizer)
    except KeyError:
        print(print_prefix+f'Key "{optimizer}" is not present in optimizer_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Optimizer "{optimizer}" is not supported')

# Main code

def train_model(
    df,
    features,
    labels,
    learning_rate,
    loss_function,
    testing_split,
    validation_split,
    epochs,
    optimizer_key ):
    
    # Prepare dataframe
    df = df.dropna()
    df = encode_cat_data(df)

    # Split dataset
    train_dataset, test_dataset = train_test_split(df)

    # Separate labels from features
    train_features = train_dataset.copy()
    test_features = test_dataset.copy()

    for label in labels:
        train_labels = train_features.pop(label)
        test_labels = test_features.pop(label)

    # Feature normalization
    normalizer = tf.keras.layers.Normalization(axis=-1)
    normalizer.adapt(np.array(train_features))
         
    # Map optimizer key-code to actual tf optimizer     
    optimizer = map_optimizer(optimizer_key, learning_rate)

    # Make a model
    model = tf.keras.Sequential([
        normalizer,
        layers.Dense(units=1)
    ])

    # Configure the model 
    model.compile(
        optimizer=tf.optimizers.Adam(learning_rate=learning_rate),
        loss=loss_function)

    callback = tf.keras.callbacks.LambdaCallback(on_epoch_end=_on_epoch_end)

    history = linear_model.fit(
        train_features,
        train_labels,
        epochs=epochs,
        # Suppress logging.
        verbose=0,
        # Calculate validation results on x% of the training data.
        validation_split = validation_split,
        callbacks=[callback])

    plot_loss(history, train_labels[0], train_labels[0].min(), train_labels[0].max())


    return model

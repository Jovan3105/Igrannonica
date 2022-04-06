from enum import Enum
import tensorflow as tf

class Optimizer(str, Enum):
    Adam     = "Adam"
    Adadelta = "Adadelta"
    Adagrad  = "Adagrad"
    Adamax   = "Adamax"
    Ftrl     = "Ftrl"
    Nadam    = "Nadam"
    RMSprop  = "RMSprop"
    SGD      = "SGD"

def map_optimizer(optimizer_key, learning_rate):   
    optimizer_switcher = {
        Optimizer.Adam     : tf.optimizers.Adam(learning_rate=learning_rate),
        Optimizer.Adadelta : tf.optimizers.Adadelta(learning_rate=learning_rate),
        Optimizer.Adamax   : tf.optimizers.Adamax(learning_rate=learning_rate),
        Optimizer.Ftrl     : tf.optimizers.Ftrl(learning_rate=learning_rate),
        Optimizer.Nadam    : tf.optimizers.Nadam(learning_rate=learning_rate),
        Optimizer.RMSprop  : tf.optimizers.RMSprop(learning_rate=learning_rate),
        Optimizer.SGD      : tf.optimizers.SGD(learning_rate=learning_rate)
    }

    try:         
        return optimizer_switcher.get(optimizer_key)
    except KeyError:
        log(f'Key "{optimizer}" is not present in optimizer_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Optimizer "{optimizer_key}" is not supported')
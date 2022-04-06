from enum import Enum

class ActivationFunction(str, Enum):
    NoActivationfunction = None
    Elu                  = "elu"
    Exponential          = "exponential"
    GeLu                 = "gelu"
    HardSigmoid          = "hard_sigmoid"
    Linear               = "linear"
    ReLu                 = "relu"
    SeLu                 = "selu"
    Sigmoid              = "sigmoid"
    Softmax              = "softmax"
    Softplus             = "softplus"
    Softsign             = "softsign"
    Swish                = "swish"
    Tanh                 = "tanh"
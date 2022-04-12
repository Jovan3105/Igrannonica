from enum import Enum
import tensorflow as tf

class Metric(str, Enum):
    # AUC
    Accuracy                      = "Accuracy"
    BinaryAccuracy                = "BinaryAccuracy"
    BinaryCrossentropy            = "BinaryCrossentropy"
    #BinaryIoU   = "BinaryIoU"
    CategoricalAccuracy           = "CategoricalAccuracy"
    CategoricalCrossentropy       = "CategoricalCrossentropy"
    CategoricalHinge              = "CategoricalHinge"
    FalseNegatives                = "FalseNegatives"
    FalsePositives                = "FalsePositives"
    Hinge                         = "Hinge"
    #IoU = "IoU"
    KLDivergence                  = "KLDivergence"
    LogCoshError                  = "LogCoshError"
    Mean                          = "Mean"
    MeanAbsoluteError             = "MeanAbsoluteError"
    MeanAbsolutePercentageError   = "MeanAbsolutePercentageError"
    #MeanIoU      = "MeanIoU"
    #MeanRelativeError             = "MeanRelativeError" required normalizer
    MeanSquaredError              = "MeanSquaredError"
    MeanSquaredLogarithmicError   = "MeanSquaredLogarithmicError"
    #MeanTensor
    #OneHotIoU
    #OneHotMeanIoU
    Poisson                       = "Poisson"
    Precision                     = "Precision"
    #PrecisionAtRecall             = "PrecisionAtRecall" required recall
    Recall                        = "Recall"
    #RecallAtPrecision             = "RecallAtPrecision" required precision
    RootMeanSquaredError          = "RootMeanSquaredError"
    #SensitivityAtSpecificity      = "SensitivityAtSpecificity" required specificity
    SparseCategoricalAccuracy     = "SparseCategoricalAccuracy"
    SparseCategoricalCrossentropy = "SparseCategoricalCrossentropy"
    #SparseTopKCategoricalAccuracy = "SparseTopKCategoricalAccuracy"
    #SpecificityAtSensitivity      = "SpecificityAtSensitivity" required sensitivity
    SquaredHinge                  = "SquaredHinge"
    Sum                           = "Sum"
    #TopKCategoricalAccuracy       = "TopKCategoricalAccuracy"
    TrueNegatives                 = "TrueNegatives"
    TruePositives                 = "TruePositives"

    def __str__(self):
        return str(self.value)

def map_metrics(metrics):   
    metric_switcher = {
        Metric.Accuracy                      : tf.keras.metrics.Accuracy(),
        Metric.BinaryAccuracy                : tf.keras.metrics.BinaryAccuracy(),
        Metric.BinaryCrossentropy            : tf.keras.metrics.BinaryCrossentropy(),
        #Metric.BinaryIoU   : tf.keras.metrics.BinaryIoU(),
        Metric.CategoricalAccuracy           : tf.keras.metrics.CategoricalAccuracy(),
        Metric.CategoricalCrossentropy       : tf.keras.metrics.CategoricalCrossentropy(),
        Metric.CategoricalHinge              : tf.keras.metrics.CategoricalHinge(),
        Metric.FalseNegatives                : tf.keras.metrics.FalseNegatives(),
        Metric.FalsePositives                : tf.keras.metrics.FalsePositives(),
        Metric.Hinge                         : tf.keras.metrics.Hinge(),
        #Metric.IoU : tf.keras.metrics.IoU(),
        Metric.KLDivergence                  : tf.keras.metrics.KLDivergence(),
        Metric.LogCoshError                  : tf.keras.metrics.LogCoshError(),
        Metric.Mean                          : tf.keras.metrics.Mean(),
        Metric.MeanAbsoluteError             : tf.keras.metrics.MeanAbsoluteError(),
        Metric.MeanAbsolutePercentageError   : tf.keras.metrics.MeanAbsolutePercentageError(),
        #Metric.MeanIoU      : tf.keras.metrics.MeanIoU(),
        #Metric.MeanRelativeError             : tf.keras.metrics.MeanRelativeError(),
        Metric.MeanSquaredError              : tf.keras.metrics.MeanSquaredError(),
        Metric.MeanSquaredLogarithmicError   : tf.keras.metrics.MeanSquaredLogarithmicError(),
        #Metric.MeanTensor
        #Metric.OneHotIoU
        #Metric.OneHotMeanIoU
        Metric.Poisson                       : tf.keras.metrics.Poisson(),
        Metric.Precision                     : tf.keras.metrics.Precision(),
        #Metric.PrecisionAtRecall             : tf.keras.metrics.PrecisionAtRecall(),
        Metric.Recall                        : tf.keras.metrics.Recall(),
        #Metric.RecallAtPrecision             : tf.keras.metrics.RecallAtPrecision(), required precision
        Metric.RootMeanSquaredError          : tf.keras.metrics.RootMeanSquaredError(),
        #Metric.SensitivityAtSpecificity      : tf.keras.metrics.SensitivityAtSpecificity(), required specificity
        Metric.SparseCategoricalAccuracy     : tf.keras.metrics.SparseCategoricalAccuracy(),
        Metric.SparseCategoricalCrossentropy : tf.keras.metrics.SparseCategoricalCrossentropy(),
        #Metric.SparseTopKCategoricalAccuracy : tf.keras.metrics.SparseTopKCategoricalAccuracy(),
        #Metric.SpecificityAtSensitivity      : tf.keras.metrics.SpecificityAtSensitivity(), required sensitivity
        Metric.SquaredHinge                  : tf.keras.metrics.SquaredHinge(),
        Metric.Sum                           : tf.keras.metrics.Sum(),
        #Metric.TopKCategoricalAccuracy       : tf.keras.metrics.TopKCategoricalAccuracy(),
        Metric.TrueNegatives                 : tf.keras.metrics.TrueNegatives(),
        Metric.TruePositives                 : tf.keras.metrics.TruePositives()
    }

    mapped_metrics = []
    try:         
        for metric in metrics:
            mapped_metrics += [metric_switcher.get(metric)]

        return mapped_metrics
    except (KeyError, AttributeError):
        log(f'Key "{metric}" is not present in metric_switcher dictionary')
        raise HTTPException(status_code=400, detail=f'Metric "{metric}" is not supported')
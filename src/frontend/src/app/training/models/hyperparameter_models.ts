export class Hyperparameter
{
    name?:string;
    info?:string;
    codename?:String;
}

export class Constants{
    static readonly ACTIVATION_FUNCTIONS: Hyperparameter[]= [
        {name: 'Sigmoid', info: 'Sigmoid!', codename: 'sigmoid'},
        {name: 'ReLu', info: 'ReLu!', codename: 'relu'},
        {name: 'Activation function2', info: 'Activation function2!', codename: 'function1'},
        {name: 'Activation function3', info: 'Activation function3!', codename: 'function2'},
      ];

    static readonly OPTIMIZER_FUNCTIONS: Hyperparameter[] = [
        {name: 'Adam', info: 'Adam!', codename: 'adam'},
        {name: 'Adadelta', info: 'Adadelta!', codename: 'adadelta'},
        {name: 'Adagrad', info: 'Adagrad!', codename: 'adagrad'},
        {name: 'Adamax', info: 'Adamax!', codename: 'adamax'},
        {name: 'Ftrl', info: 'Ftrl!', codename: 'ftrl'},
        {name: 'Nadam', info: 'Nadam!', codename: 'nadam'},
        {name: 'RMSprop', info: 'RMSprop!', codename: 'rmsprop'},
        {name: 'SGD', info: 'SGD!', codename: 'sgd'},
      ];
    
    static readonly LOSS_FUNCTIONS: Hyperparameter[] = [
        {name: 'Binary Crossentropy', info: 'BinaryCrossentropy!', codename: 'binarycrossentropy'},
        {name: 'Binary Focal Crossentropy', info: 'BinaryFocalCrossentropy!', codename: 'binaryfocalcrossentropy'},
        {name: 'Categorical Crossentropy', info: 'CategoricalCrossentropy!', codename: 'categoricalcrossentropy'},
        {name: 'Categorical Hinge', info: 'CategoricalHinge!', codename: 'categoricalhinge'},
        {name: 'Cosine Similarity', info: 'CosineSimilarity!', codename: 'cosinesimilarity'},
        {name: 'Hinge', info: 'Hinge!', codename: 'hinge'},
        {name: 'Huber', info: 'Huber!', codename: 'huber'},
        {name: 'KL Divergence', info: 'KLDivergence!', codename: 'kldivergence'},
        {name: 'Mean Absolute Error', info: 'MeanAbsoluteError!', codename: 'meanabsoluteerror'},
        {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'meanabsolutepercentageerror'},
        {name: 'Mean Squared Error', info: 'MeanSquaredError!', codename: 'meansquarederror'},
        {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'meansquaredlogarithmicerror'},
        {name: 'Poisson', info: 'Poisson!', codename: 'poisson'},
        {name: 'Sparse Categorical Crossentropy', info: 'SparseCategoricalCrossentropy!', codename: 'sparsecategoricalcrossentropy'},
        {name: 'Squared Hinge', info: 'SquaredHinge!', codename: 'squaredhinge'},
      ];
    static readonly METRICS : Hyperparameter[] = [
        {name: 'Accuracy', info: 'Accuracy!', codename: 'accuracy'},
        {name: 'Binary Accuracy', info: 'BinaryAccuracy!', codename: 'binaryaccuracy'},
        {name: 'Categorical Accuracy', info: 'CategoricalAccuracy!', codename: 'categoricalaccuracy'},
        {name: 'Categorical Hinge', info: 'CategoricalHinge!', codename: 'categoricalhinge'},
        {name: 'False Negatives', info: 'FalseNegatives!', codename: 'falsenegatives'},
        {name: 'Hinge', info: 'Hinge!', codename: 'hinge'},
        {name: 'False Positives', info: 'FalsePositives!', codename: 'falsepositives'},
        {name: 'KL Divergence', info: 'KLDivergence!', codename: 'kldivergence'},
        {name: 'Mean Absolute Error', info: 'MeanAbsoluteError!', codename: 'meanabsoluteerror'},
        {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'meanabsolutepercentageerror'},
        {name: 'Mean Squared Error', info: 'MeanSquaredError!', codename: 'meansquarederror'},
        {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'meansquaredlogarithmicerror'},
        {name: 'Poisson', info: 'Poisson!', codename: 'poisson'},
        {name: 'Sparse Categorical Crossentropy', info: 'SparseCategoricalCrossentropy!', codename: 'sparsecategoricalcrossentropy'},
        {name: 'Log Cosh Error', info: 'LogCoshError!', codename: 'logcosherror'},
        {name: 'Precision', info: 'Precision!', codename: 'precision'},
        {name: 'Recall', info: 'Recall!', codename: 'recall'},
        {name: 'Root MeanSquared Error', info: 'RootMeanSquaredError!', codename: 'rootmeansquarederror'},
        {name: 'Sparse Categorical Accuracy', info: 'SparseCategoricalAccuracy!', codename: 'sparsecategoricalaccuracy'},
        {name: 'Sum', info: 'Sum!', codename: 'sum'},
        {name: 'Squared Hinge', info: 'SquaredHinge!', codename: 'squaredhinge'},
        {name: 'True Negatives', info: 'TrueNegatives!', codename: 'truenegatives'},
        {name: 'True Positives', info: 'TruePositives!', codename: 'truepositives'},
      ];
}

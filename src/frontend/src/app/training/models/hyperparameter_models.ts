export class Hyperparameter
{
    name?:string;
    info?:string;
    codename?:String;
}

export class Constants{
    static readonly ACTIVATION_FUNCTIONS: Hyperparameter[] = [
      {name: 'Sigmoid', info: 'Sigmoid!', codename: 'Sigmoid'},
      {name: 'ReLu', info: 'ReLu!', codename: 'ReLu'},
      {name: 'Tanh', info: 'Tanh!', codename: 'Tanh'},
      {name: 'Linear', info: 'Linear!', codename: 'Linear'},
      {name: 'SeLu', info: 'SeLu!', codename: 'SeLu'},
      {name: 'Softmax', info: 'Softmax!', codename: 'Softmax'},
      {name: 'Softplus', info: 'Softplus!', codename: 'Softplus'},
      {name: 'Softsign', info: 'Softsign!', codename: 'Softsign'},
      {name: 'Exponential', info: 'Exponential!', codename: 'Exponential'},
      {name: 'Swish', info: 'Swish!', codename: 'Swish'},
      {name: 'Elu', info: 'Elu!', codename: 'Elu'},
    ];

    static readonly OPTIMIZER_FUNCTIONS: Hyperparameter[] = [
      {name: 'Adam', info: 'Adam!', codename: 'Adam'},
      {name: 'Adadelta', info: 'Adadelta!', codename: 'Adadelta'},
      {name: 'Adagrad', info: 'Adagrad!', codename: 'Adagrad'},
      {name: 'Adamax', info: 'Adamax!', codename: 'Adamax'},
      {name: 'Ftrl', info: 'Ftrl!', codename: 'Ftrl'},
      {name: 'Nadam', info: 'Nadam!', codename: 'Nadam'},
      {name: 'RMSprop', info: 'RMSprop!', codename: 'RMSprop'},
      {name: 'SGD', info: 'SGD!', codename: 'SGD'},
    ];
    
    static readonly LOSS_FUNCTIONS: Hyperparameter[] = [
      {name: 'Binary Crossentropy', info: 'BinaryCrossentropy!', codename: 'BinaryCrossentropy'},
      {name: 'Binary Focal Crossentropy', info: 'BinaryFocalCrossentropy!', codename: 'BinaryFocalCrossentropy'},
      {name: 'Categorical Crossentropy', info: 'CategoricalCrossentropy!', codename: 'CategoricalCrossentropy'},
      {name: 'Categorical Hinge', info: 'CategoricalHinge!', codename: 'CategoricalHinge'},
      {name: 'Cosine Similarity', info: 'CosineSimilarity!', codename: 'CosineSimilarity'},
      {name: 'Hinge', info: 'Hinge!', codename: 'Hinge'},
      {name: 'Huber', info: 'Huber!', codename: 'Huber'},
      {name: 'KL Divergence', info: 'KLDivergence!', codename: 'KLDivergence'},
      {name: 'Mean Absolute Error', info: 'MeanAbsoluteError!', codename: 'MeanAbsoluteError'},
      {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'MeanAbsolutePercentageError'},
      {name: 'Mean Squared Error', info: 'MeanSquaredError!', codename: 'MeanSquaredError'},
      {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'MeanSquaredLogarithmicError'},
      {name: 'Poisson', info: 'Poisson!', codename: 'Poisson'},
      //{name: 'Sparse Categorical Crossentropy', info: 'SparseCategoricalCrossentropy!', codename: 'SparseCategoricalCrossentropy'},
      {name: 'Squared Hinge', info: 'SquaredHinge!', codename: 'SquaredHinge'},
    ];
    static readonly METRICS : Hyperparameter[] = [
      {name: 'Accuracy', info: 'Accuracy!', codename: 'Accuracy'},
      {name: 'Binary Accuracy', info: 'BinaryAccuracy!', codename: 'BinaryAccuracy'},
      {name: 'Categorical Accuracy', info: 'CategoricalAccuracy!', codename: 'CategoricalAccuracy'},
      {name: 'Categorical Hinge', info: 'CategoricalHinge!', codename: 'CategoricalHinge'},
      {name: 'False Negatives', info: 'FalseNegatives!', codename: 'FalseNegatives'},
      {name: 'Hinge', info: 'Hinge!', codename: 'Hinge'},
      {name: 'False Positives', info: 'FalsePositives!', codename: 'FalsePositives'},
      {name: 'KL Divergence', info: 'KLDivergence!', codename: 'KLDivergence'},
      {name: 'Mean Absolute Error', info: 'MeanAbsoluteError!', codename: 'MeanAbsoluteError'},
      {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'MeanAbsolutePercentageError'},
      {name: 'Mean Squared Error', info: 'MeanSquaredError!', codename: 'MeanSquaredError'},
      {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'MeanSquaredLogarithmicError'},
      {name: 'Poisson', info: 'Poisson!', codename: 'Poisson'},
      //{name: 'Sparse Categorical Crossentropy', info: 'SparseCategoricalCrossentropy!', codename: 'SparseCategoricalCrossentropy'},
      {name: 'Log Cosh Error', info: 'LogCoshError!', codename: 'LogCoshError'},
      {name: 'Precision', info: 'Precision!', codename: 'Precision'},
      {name: 'Recall', info: 'Recall!', codename: 'Recall'},
      {name: 'Root MeanSquared Error', info: 'RootMeanSquaredError!', codename: 'RootMeanSquaredError'},
      //{name: 'Sparse Categorical Accuracy', info: 'SparseCategoricalAccuracy!', codename: 'SparseCategoricalAccuracy'},
      {name: 'Sum', info: 'Sum!', codename: 'Sum'},
      {name: 'Squared Hinge', info: 'SquaredHinge!', codename: 'SquaredHinge'},
      {name: 'True Negatives', info: 'TrueNegatives!', codename: 'TrueNegatives'},
      {name: 'True Positives', info: 'TruePositives!', codename: 'TruePositives'},
    ];
}

export class Column {
  name: string;
  encoder: string;
  // type: string;

  constructor(name: string, encoder: string) {
    this.name = name;
    this.encoder = encoder;
  }
}
export class Hyperparameter
{
    name?:string;
    info?:string;
    codename?:String;
    type?:String;
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
      {name: 'Binary Crossentropy', info: 'BinaryCrossentropy!', codename: 'BinaryCrossentropy', type: 'classification'},
      {name: 'Binary Focal Crossentropy', info: 'BinaryFocalCrossentropy!', codename: 'BinaryFocalCrossentropy', type: 'classification'},
      {name: 'Categorical Crossentropy', info: 'CategoricalCrossentropy!', codename: 'CategoricalCrossentropy', type: 'classification'},
      {name: 'Categorical Hinge', info: 'CategoricalHinge!', codename: 'CategoricalHinge', type: 'classification'},
      {name: 'Cosine Similarity', info: 'CosineSimilarity!', codename: 'CosineSimilarity', type: 'classification'},
      {name: 'Hinge', info: 'Hinge!', codename: 'Hinge', type: 'classification'},
      {name: 'Huber', info: 'Huber!', codename: 'Huber', type: 'classification'},
      {name: 'KL Divergence', info: 'KLDivergence!', codename: 'KLDivergence', type: 'classification'},
      {name: 'Mean Absolute Error', info: 'MeanAbsoluteError!', codename: 'MeanAbsoluteError', type: 'regression'},
      {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'MeanAbsolutePercentageError', type: 'regression'},
      {name: 'Mean Squared Error', info: 'MeanSquaredError!', codename: 'MeanSquaredError', type: 'regression'},
      {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'MeanSquaredLogarithmicError', type: 'regression'},
      {name: 'Poisson', info: 'Poisson!', codename: 'Poisson', type: 'regression'},
      //{name: 'Sparse Categorical Crossentropy', info: 'SparseCategoricalCrossentropy!', codename: 'SparseCategoricalCrossentropy'},
      {name: 'Squared Hinge', info: 'SquaredHinge!', codename: 'SquaredHinge', type: 'classification'},
    ];
    static readonly METRICS : Hyperparameter[] = [
      {name: 'Accuracy', info: 'Accuracy!', codename: 'Accuracy', type: 'classification'},
      {name: 'Binary Accuracy', info: 'BinaryAccuracy!', codename: 'BinaryAccuracy', type: 'classification'},
      {name: 'Categorical Accuracy', info: 'CategoricalAccuracy!', codename: 'CategoricalAccuracy', type: 'classification'},
      {name: 'Categorical Hinge', info: 'CategoricalHinge!', codename: 'CategoricalHinge', type: 'classification'},
      {name: 'False Negatives', info: 'FalseNegatives!', codename: 'FalseNegatives', type: 'classification'},
      {name: 'Hinge', info: 'Hinge!', codename: 'Hinge', type: 'classification'},
      {name: 'False Positives', info: 'FalsePositives!', codename: 'FalsePositives', type: 'classification'},
      {name: 'KL Divergence', info: 'KLDivergence!', codename: 'KLDivergence', type: 'classification'},
      {name: 'Mean Absolute Error', info: 'MeanAbsoluteError!', codename: 'MeanAbsoluteError', type: 'regression'},
      {name: 'Mean Absolute Percentage Error', info: 'MeanAbsolutePercentageError!', codename: 'MeanAbsolutePercentageError', type: 'regression'},
      {name: 'Mean Squared Error', info: 'MeanSquaredError!', codename: 'MeanSquaredError', type: 'regression'},
      {name: 'Mean Squared Logarithmic Error', info: 'MeanSquaredLogarithmicError!', codename: 'MeanSquaredLogarithmicError', type: 'regression'},
      {name: 'Poisson', info: 'Poisson!', codename: 'Poisson', type: 'regression'},
      //{name: 'Sparse Categorical Crossentropy', info: 'SparseCategoricalCrossentropy!', codename: 'SparseCategoricalCrossentropy'},
      {name: 'Log Cosh Error', info: 'LogCoshError!', codename: 'LogCoshError', type: 'regression'},
      {name: 'Precision', info: 'Precision!', codename: 'Precision', type: 'classification'},
      {name: 'Recall', info: 'Recall!', codename: 'Recall', type: 'classification'},
      {name: 'Root MeanSquared Error', info: 'RootMeanSquaredError!', codename: 'RootMeanSquaredError', type: 'regression'},
      //{name: 'Sparse Categorical Accuracy', info: 'SparseCategoricalAccuracy!', codename: 'SparseCategoricalAccuracy'},
      {name: 'Sum', info: 'Sum!', codename: 'Sum', type: 'regression'},
      {name: 'Squared Hinge', info: 'SquaredHinge!', codename: 'SquaredHinge', type: 'classification'},
      {name: 'True Negatives', info: 'TrueNegatives!', codename: 'TrueNegatives', type: 'classification'},
      {name: 'True Positives', info: 'TruePositives!', codename: 'TruePositives', type: 'classification'},
    ];

    static readonly WEIGHT_INITIALIZERS: Hyperparameter[] = [
      {name: 'Constant', info: 'Constant!', codename: 'Constant'},
      {name: 'Glorot Normal', info: 'GlorotNormal!', codename: 'GlorotNormal'},
      {name: 'Glorot Uniform', info: 'GlorotUniform!', codename: 'GlorotUniform'},
      {name: 'HeNormal', info: 'HeNormal!', codename: 'HeNormal'},
      {name: 'HeUniform', info: 'HeUniform!', codename: 'HeUniform'},
      {name: 'Identity', info: 'Identity!', codename: 'Identity'},
      {name: 'Lecun Normal', info: 'LecunNormal!', codename: 'LecunNormal'},
      {name: 'Lecun Uniform', info: 'LecunUniform!', codename: 'LecunUniform'},
      {name: 'Ones', info: 'OnesExpOnesonential!', codename: 'Ones'},
      {name: 'Orthogonal', info: 'Orthogonal!', codename: 'Orthogonal'},
      {name: 'Random Normal', info: 'RandomNormal!', codename: 'RandomNormal'},
      {name: 'Random Uniform', info: 'RandomUniform!', codename: 'RandomUniform'},
      {name: 'Truncated Normall', info: 'TruncatedNormal!', codename: 'TruncatedNormal'},
      {name: 'Zeros', info: 'Zeros!', codename: 'Zeros'},
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
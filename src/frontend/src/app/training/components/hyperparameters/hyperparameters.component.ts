import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { DomSanitizer } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-hyperparameters',
  templateUrl: './hyperparameters.component.html',
  styleUrls: ['./hyperparameters.component.css']
})
export class HyperparametersComponent implements OnInit 
{
  @Input() featuresLabel:any;
  @Input() datasetId:any;
  
  loaderMiniDisplay:string = "none";
  readonly backendSocketUrl = environment.backendSocketUrl;

  constructor(private trainingService: TrainingService, private domSanitizer: DomSanitizer) { }

  activationFunctions: Hyperparameter[] = Constants.ACTIVATION_FUNCTIONS;
  optimizerFunctions: Hyperparameter[] = Constants.OPTIMIZER_FUNCTIONS;
  lossFunctions: Hyperparameter[] = Constants.LOSS_FUNCTIONS;
  metrics: Hyperparameter[] = Constants.METRICS;

  //activationFunctionControl = new FormControl('', Validators.required);
  optimizerFunctionControl = new FormControl('', Validators.required);
  lossFunctionControl = new FormControl('', Validators.required);
  metricsControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  problemType: string = "regression";
  numberOfEpochs: number = 1000;
  learningRate: number = 0.1;
  corrMatrixSource: any;
  metricsArrayToSend: any[] = [];

  sliderValue: number = 80;
  sliderOptions: Options = {
    floor: 10,
    ceil: 90,
    step: 10,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      if (value <= 25) {
          return 'red';
      }
      if (value <= 50) {
          return 'orange';
      }
      if (value <= 75) {
          return 'yellow';
      }
      return '#2AE02A';
    },
    getPointerColor: (value: number): string => {
      return '#0d6efd';
    },
    translate: (value: number): string => {
      return value+"%";
    }
  };

  ngOnInit(): void 
  {
  }

  layers= [
    {"units":4,"af":"ReLu"},
    {"units":2,"af":"ReLu"}
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
  }

  removeLayer(index:number){
    this.layers.splice(index, 1);
  }
  

  addLayer(){
    this.layers.push({"units":1,"af":"ReLu"});
  }
  
  startTrainingObserver:any = {
    next: (response:any) => { 
      console.log("training > components > hyperparameters > hyperparameters.component.ts > startTrainingObserver > next:")
      console.log(response)
      
      this.loaderMiniDisplay = 'none'; // TODO 
    },
    error: (err: Error) => {
      console.log("training > components > hyperparameters > hyperparameters.component.ts > startTrainingObserver >  error:")
      console.log(err)
    }
  };

  changeEpoch(value: number): void {
    //this.numberOfEpochs = value;
  }
  changeRate(value: number): void {
    value = +value.toFixed(2)
    //this.learningRate = value;
  }
  
  TrainingClick(){
    //this.loaderDisplay = "block";
    //this.secondVisibility = "none";
    this.loaderMiniDisplay = "block";
    // var trainingService=this.trainingService;
    let connectionID = "";
    // this.trainingService.sendDataForTraining({
    //   epochs: this.numberOfEpochs,
    //   activationFunction: this.activationFunctionControl.value.codename,
    //   features: this.featuresLabel['features'],
    //   labels: this.featuresLabel['label'],
    //   optimizer: this.optimizerFunctionControl.value.codename,
    //   lossFunction: this.lossFunctionControl.value.codename,
    //   testDataRatio: this.sliderValue/100,
    //   learningRate: this.learningRate,
    //   metrics: this.metricsArrayToSend,
    //   layers: this.layers
    // }).subscribe(this.startTrainingObserver);
    console.log(this.metricsControl)
    // console.log("optimizer "+ this.optimizerFunctionControl.value.codename)
    // console.log("testDataRatio "+ this.sliderValue/100)
    // console.log("metrics "+ this.metricsControl.value)
    // console.log("lossFunction "+ this.lossFunctionControl.value.codename)
    // console.log("metric array to send "+ this.metricsArrayToSend)

    
    // izdvajanje naziva feature-a u poseban niz
    var featuresStr = []
    for (let index = 0; index < this.featuresLabel['features'].length; index++) {
      const element = this.featuresLabel['features'][index];
      featuresStr.push(element["name"]);
    }
      
    // izdvajanje naziva feature-a u poseban niz
    var lablesStr = []
    for (let index = 0; index < this.featuresLabel['label'].length; index++) {
      const element = this.featuresLabel['label'][index];
      lablesStr.push(element["name"]);
    }

    // izdvajanje codename metrika-a u poseban niz
    for (let index = 0; index < this.metricsControl.value.length; index++) {
      const element = this.metricsControl.value[index];
      this.metricsArrayToSend.push(element["codename"]);
    }
    //console.log(this.metricsArrayToSend)

    var trainingRequestPayload = {
      DatasetID             : this.datasetId,
      ClientConnID          : connectionID,
      ProblemType           : this.problemType,
      Layers                : [// TODO hardcoded, ispraviti kada se doda vizuelizacija i izbor arhitekture
        { 
          index : 0,
          units : 32,
          weight_initializer  : "HeUniform",
          activation_function : "ReLu",
        },
        { 
          index : 1,
          units : 8,
          weight_initializer  : "HeUniform",
          activation_function : "ReLu",
        },
        { 
          index : 2,
          units : 1,
          weight_initializer  : "HeUniform",
          activation_function : "ReLu",
        }
      ],
      Features              : featuresStr,
      Labels                : lablesStr,
      Metrics               : this.metricsArrayToSend,
      LossFunction          : this.lossFunctionControl.value.codename,
      TestDatasetSize       : this.sliderValue / 100,
      ValidationDatasetSize : 0.2, // TODO hardcoded, promeniti kada se implementira UI komponenta
      Epochs                : this.numberOfEpochs,
      Optimizer             : this.optimizerFunctionControl.value.codename,
      LearningRate          : this.learningRate
    }
    let subject = new WebSocket(this.backendSocketUrl); // TODO promeniti zbog prod (izmestiti u env)
    console.log(trainingRequestPayload)
    console.log(this.lossFunctionControl)
    subject.onopen = function (evt){
      console.log("Socket connection is established");
    }
    let _this = this
    
    subject.onmessage = function (evt) {
      var dataArr = evt.data.split(" ", 2)

      // proveri da li je rec o dodeli ID-a
      if(dataArr[0] == "ConnID:") {
        connectionID = dataArr[1];
        trainingRequestPayload["ClientConnID"] = connectionID;
        _this.trainingService.sendDataForTraining(trainingRequestPayload).subscribe(_this.startTrainingObserver);
        console.log(`My connection ID: ${connectionID}`);
      }
      else {
        // TODO iskoristiti za vizuelizaciju
        let epoch_stats = JSON.parse(evt.data)
        console.log(epoch_stats);
      }
    }

    //  subject.close(); //zatvara socket
    subject.onclose = function(evt){
      console.log("Connection is terminated");
    }
  }
}


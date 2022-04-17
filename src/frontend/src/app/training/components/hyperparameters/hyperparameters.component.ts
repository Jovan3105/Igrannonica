import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { DomSanitizer } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';


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

  constructor(private trainingService: TrainingService, private domSanitizer: DomSanitizer) { }
  

  activationFunctions: Hyperparameter[] = Constants.ACTIVATION_FUNCTIONS;
  optimizerFunctions: Hyperparameter[] = Constants.OPTIMIZER_FUNCTIONS;
  lossFunctions: Hyperparameter[] = Constants.LOSS_FUNCTIONS;
  metrics: Hyperparameter[] = Constants.METRICS;

  activationFunctionControl = new FormControl('', Validators.required);
  optimizerFunctionControl = new FormControl('', Validators.required);
  lossFunctionControl = new FormControl('', Validators.required);
  metricsControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  numberOfEpochs: number = 4;
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
  
  startTrainingObserver:any = {
    next: (response:any) => { 
      console.log("dashboard > DashboardComponent > startTrainingObserver > next:")
      console.log(response)
        
    },
    error: (err: Error) => {
      console.log("dashboard > DashboardComponent > startTrainingObserver > error:")
      console.log(err)
    }
  };

  changeEpoch(value: number): void {
    //console.log(value);
    this.numberOfEpochs = value;
  }
  changeRate(value: number): void {
    value = +value.toFixed(2)
    this.learningRate = value;
  }
  
  TrainingClick(){
    //this.loaderDisplay = "block";
    //this.secondVisibility = "none";
    this.loaderMiniDisplay = "block";
    var trainingService=this.trainingService;
    var featureL = this.featuresLabel;
    let subject = new WebSocket('ws://localhost:7220'); // TODO promeniti zbog prod (izmestiti u env)
    let connId = "";

    subject.onopen = function (evt){
      console.log("opened conn");
    }

    subject.onmessage= function (evt) {

      var dataArr=evt.data.split(" ",2)
      if(dataArr[0]=="ConnID:"){
          connId=dataArr[1];
          objtoSend["ClientConnID"] = connId;
          trainingService.sendDataForTraining(objtoSend).subscribe();
          console.log(connId);
      }
      else if(dataArr[0]=="Odstupanje:"){
        //desava nesto sa grafikom
        console.log(dataArr[1]);
      }
      console.log(evt.data);
    }

    subject.onclose=function(evt){
      console.log("connection closed");
    }
    //subject.close(); //zatbara socket


    var nizF=[]

    for (let index = 0; index < this.featuresLabel['features'].length; index++) {
      const element = this.featuresLabel['features'][index];

      nizF.push(element["name"]);

    }

    console.log(this.featuresLabel['label'] );

    var nizL=[]
    for (let index = 0; index < this.featuresLabel['label'] .length; index++) {
      const element = this.featuresLabel['label'][index];

      nizL.push(element["name"]);

    }

    var objtoSend={
      DatasetID             : this.datasetId,
      ClientConnID          : connId,
      ProblemType           : "regression",
      Layers                : [/**/
        { 
          index : 0,
          units : 32,
          weight_initializer : "HeUniform",
          activation_function : this.activationFunctionControl.value.codename,
        },
        { 
          index : 1,
          units : 8,
          weight_initializer : "HeUniform",
          activation_function : this.activationFunctionControl.value.codename,
        },
        { 
          index : 2,
          units : 1,
          weight_initializer : "HeUniform",
          activation_function : this.activationFunctionControl.value.codename,
        }
      ],
      Features              : nizF,
      Labels                : nizL,
      Metrics               : this.metricsArrayToSend,
      LossFunction          : this.lossFunctionControl.value.codename,
      TestDatasetSize       : this.sliderValue/100,
      ValidationDatasetSize : 0.2,
      Epochs                : this.numberOfEpochs,
      Optimizer             : this.optimizerFunctionControl.value.codename,
      LearningRate          : this.learningRate
    }
    console.log(connId);
    console.log(JSON.stringify(nizL))
    // this.trainingService.sendDataForTraining(objtoSend).subscribe(this.startTrainingObserver)

    let conn = function(evt:any){
      console.log("connnnnected");

    }
  }
}


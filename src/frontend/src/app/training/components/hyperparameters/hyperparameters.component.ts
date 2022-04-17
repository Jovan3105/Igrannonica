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
    this.trainingService.sendDataForTraining({
      epochs: this.numberOfEpochs,
      activationFunction: this.activationFunctionControl.value.codename,
      features: this.featuresLabel['features'],
      labels: this.featuresLabel['label'],
      optimizer: this.optimizerFunctionControl.value.codename,
      lossFunction: this.lossFunctionControl.value.codename,
      testDataRatio: this.sliderValue/100,
      learningRate: this.learningRate,
      metrics: this.metricsArrayToSend
    }).subscribe(this.startTrainingObserver);
    // console.log("metric control "+ this.metricsControl.value[0].codename)
    // console.log("optimizer "+ this.optimizerFunctionControl.value.codename)
    // console.log("testDataRatio "+ this.sliderValue/100)
    // console.log("metrics "+ this.metricsControl.value)
    // console.log("lossFunction "+ this.lossFunctionControl.value.codename)
    // console.log("metric array to send "+ this.metricsArrayToSend)

  }
}


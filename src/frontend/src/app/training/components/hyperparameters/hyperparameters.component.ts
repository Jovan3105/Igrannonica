import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Column, Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { DomSanitizer } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { throwIfEmpty } from 'rxjs';
import { TrainingViewComponent } from '../../_training-view/training-view.component';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-hyperparameters',
  templateUrl: './hyperparameters.component.html',
  styleUrls: ['./hyperparameters.component.css']
})
export class HyperparametersComponent implements OnInit 
{
  @Input() choosenInAndOutCols:any;
  @Input() datasetId:any;
  
  loaderMiniDisplay:string = "none";
  readonly backendSocketUrl = environment.backendSocketUrl;

  constructor(private trainingViewComponent:TrainingViewComponent, private trainingService: TrainingService, private domSanitizer: DomSanitizer) { }

  activationFunctions: Hyperparameter[] = Constants.ACTIVATION_FUNCTIONS;
  optimizerFunctions: Hyperparameter[] = Constants.OPTIMIZER_FUNCTIONS;
  lossFunctions: Hyperparameter[] = Constants.LOSS_FUNCTIONS;
  metrics: Hyperparameter[] = Constants.METRICS;
  weightInitializers: Hyperparameter[] = Constants.WEIGHT_INITIALIZERS;

  //activationFunctionControl = new FormControl('', Validators.required);
  optimizerFunctionControl = new FormControl('', Validators.required);
  lossFunctionControl = new FormControl('', Validators.required);
  metricsControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  @ViewChild('metricSelect') metricSelect!: MatSelect;
  @ViewChild('lossSelect') lossSelect!: MatSelect;

  problemType: string = "regression";
  selectedNumerical: string = "false";
  selectedCategorical: string = "false"
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
    }
  ];

  epoches_data:{epoch: number,loss: number,mean_absolute_error: number,val_loss: number,val_mean_absolute_error: number}[]=[];

  loss_arr:number[]=[];
  val_loss_arr:number[]=[];
  epoches_arr:number[]=[0];

  prikaz:string="none";

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
  }

  removeLayer(index:number){
    this.layers.splice(index, 1);
  }
  

  addLayer(){
    this.layers.push({ 
      index : this.layers.length-1,
      units : 12,
      weight_initializer  : "HeUniform",
      activation_function : "ReLu",
    });
  }

  changeWeight(selected:string,index:number)
  {
    this.layers[index].weight_initializer=selected;
  }

  changeActivation(event:[string,number])
  {
    this.layers[event[1]].activation_function=event[0];
    console.log(this.layers);
    console.log(this.layers);
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
    this.loaderMiniDisplay = "block";
    let connectionID = "";
    
    // izdvajanje naziva feature-a u poseban niz
    var features = []
    for (let index = 0; index < this.choosenInAndOutCols['features'].length; index++) {
      const element = this.choosenInAndOutCols['features'][index];
      features.push(new Column(element["name"], element["encoding"]));
    } 
      
    // izdvajanje naziva label-a u poseban niz
    var lables = []
    const element = this.choosenInAndOutCols['label'];
    lables.push(new Column(element["name"], element["encoding"]));

    // izdvajanje codename-ova metrika u poseban niz
    this.metricsArrayToSend = this.metricsControl.value.map(
      (item:any)=>item['codename']);

    var trainingRequestPayload = {
      DatasetID             : this.datasetId,
      ClientConnID          : connectionID,
      ProblemType           : this.problemType,
      Layers                : this.layers,
      Features              : features,
      Labels                : lables,
      Metrics               : this.metricsArrayToSend,
      LossFunction          : this.lossFunctionControl.value.codename,
      TestDatasetSize       : this.sliderValue / 100,
      ValidationDatasetSize : 0.2, // TODO hardcoded, promeniti kada se implementira UI komponenta
      Epochs                : this.numberOfEpochs,
      Optimizer             : this.optimizerFunctionControl.value.codename,
      LearningRate          : this.learningRate
    }
    let subject = new WebSocket(this.backendSocketUrl);
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
        _this.epoches_data=[];
        _this.prikaz="block";
      }
      else {
        // TODO iskoristiti za vizuelizaciju
        let epoch_stats = JSON.parse(evt.data)
        console.log(epoch_stats);
        _this.epoches_data.push(epoch_stats);
        // TODO srediti da se salje samo element a ne ceo niz
        _this.loss_arr=_this.epoches_data.map(a => a.loss);
        _this.val_loss_arr=_this.epoches_data.map(a => a.val_loss);
        _this.epoches_arr=_this.epoches_data.map(a => a.epoch);
      }
    }

    //  subject.close(); //zatvara socket
    subject.onclose = function(evt){
      console.log("Connection is terminated");
    }
  }
  reset(){
    this.metricSelect.options.forEach((data: MatOption) => data.deselect());
    this.lossSelect.options.forEach((data: MatOption) => data.deselect());
  }
}


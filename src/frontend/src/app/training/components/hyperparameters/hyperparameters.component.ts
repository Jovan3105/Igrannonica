import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Column, Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { DomSanitizer } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { throwIfEmpty } from 'rxjs';
import { TrainingViewComponent } from '../../_training-view/training-view.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ChosenColumn } from '../../models/table_models';

@Component({
  selector: 'app-hyperparameters',
  templateUrl: './hyperparameters.component.html',
  styleUrls: ['./hyperparameters.component.css']
})
export class HyperparametersComponent implements OnInit, OnChanges 
{
  @Input() choosenInAndOutCols:{features:ChosenColumn[],label:ChosenColumn} | undefined = undefined;
  @Input() datasetId:any;
  
  loaderMiniDisplay:string = "none";
  readonly backendSocketUrl = environment.backendSocketUrl;

  constructor(private trainingViewComponent:TrainingViewComponent, private trainingService: TrainingService, private domSanitizer: DomSanitizer, private fb: FormBuilder) { }

  activationFunctions: Hyperparameter[] = Constants.ACTIVATION_FUNCTIONS;
  optimizerFunctions: Hyperparameter[] = Constants.OPTIMIZER_FUNCTIONS;
  lossFunctions: Hyperparameter[] = Constants.LOSS_FUNCTIONS;
  metrics: Hyperparameter[] = Constants.METRICS;
  weightInitializers: Hyperparameter[] = Constants.WEIGHT_INITIALIZERS;

  formGroup!: FormGroup;
  //activationFunctionControl = new FormControl('', Validators.required);
  optimizerFunctionControl = new FormControl('', Validators.required);
  lossFunctionControl = new FormControl('', Validators.required);
  metricsControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  @ViewChild('allMetricsSelected') allMetricsSelected!: MatOption;

  @ViewChild('metricsSelect') metricsSelect!: MatSelect;
  @ViewChild('lossSelect') lossSelect!: MatSelect;

  allSelected: boolean = false;
  problemType: string = "regression";
  selectedNumerical: string = "false";
  selectedCategorical: string = "false"
  numberOfEpochs: number = 1000;
  learningRate: number = 0.1;
  corrMatrixSource: any;
  metricsArrayToSend: any[] = [];

  sliderValueTest: number = 20;
  sliderValueValidation: number = 20;
  sliderOptions: Options = {
    floor: 10,
    ceil: 90,
    step: 5,
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
  ngOnChanges(changes: SimpleChanges): void 
  { 
    if (this.choosenInAndOutCols !== undefined && this.choosenInAndOutCols.label !== undefined)
    {
      this.problemType = this.choosenInAndOutCols.label.type == "Categorical"? "classification":"regression";
    }
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

  epoches_data:any[]=[];

  graph_metric="loss";

  training_arr:number[]=[];
  val_arr:number[]=[];
  epoches_arr:number[]=[0];

  collapse:string="block";

  prikaz:string="none";
  started:boolean=false;
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

  timesClicked:number=-1;

  changeGraphMetric(codename:string)
  {
    if(this.timesClicked>0 && (codename=="false_negatives" || codename=="false_positives" || codename=="precision" || codename=="recall" || codename=="true_negatives" || codename=="true_positived"))
          this.graph_metric=codename+"_"+this.timesClicked;
    else
      this.graph_metric=codename;
    this.training_arr=this.epoches_data.map(a=>a[this.graph_metric]);
    this.val_arr=this.epoches_data.map(a=>a["val_"+this.graph_metric]);
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
    this.numberOfEpochs = value;
  }
  changeRate(value: number): void {
    value = +value.toFixed(2)
    //this.learningRate = value;
  }
  
  TrainingClick(){
    this.loaderMiniDisplay = "block";
    let connectionID = "";
    this.timesClicked+=1;
    
    // izdvajanje naziva feature-a u poseban niz
    var features = []
    for (let index = 0; index < this.choosenInAndOutCols!['features'].length; index++) {
      const element = this.choosenInAndOutCols!['features'][index];
      features.push(new Column(element["name"], element["encoding"]));
    } 
      
    // izdvajanje naziva label-a u poseban niz
    var lables = []
    const element = this.choosenInAndOutCols!['label'];
    lables.push(new Column(element["name"], element["encoding"]));

    // izdvajanje codename-ova metrika u poseban niz
    this.metricsArrayToSend = this.metricsControl.value.map(
      (item:any)=>item['codename']);
    
    
    if(this.metricsArrayToSend[0] == undefined)
      this.metricsArrayToSend.shift();

    var trainingRequestPayload = {
      DatasetID             : this.datasetId,
      ClientConnID          : connectionID,
      ProblemType           : this.problemType,
      Layers                : this.layers,
      Features              : features,
      Labels                : lables,
      Metrics               : this.metricsArrayToSend,
      LossFunction          : this.lossFunctionControl.value.codename,
      TestDatasetSize       : this.sliderValueTest / 100,
      ValidationDatasetSize : this.sliderValueValidation / 100,
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
        _this.collapse="none";
        _this.epoches_data=[];
        _this.training_arr=[];
        _this.val_arr=[];
        _this.prikaz="inline-block";
        _this.started=true;
      }
      else {
        // TODO iskoristiti za vizuelizaciju
        let epoch_stats = JSON.parse(evt.data)
        console.log(epoch_stats);
        _this.epoches_data.push(epoch_stats);
        // TODO srediti da se salje samo element a ne ceo niz
        _this.training_arr=_this.epoches_data.map(a=>a[_this.graph_metric]);
        _this.val_arr=_this.epoches_data.map(a=>a["val_"+_this.graph_metric]);
        _this.epoches_arr=_this.epoches_data.map(a=> a.epoch);
        if(_this.training_arr.length==_this.numberOfEpochs)
          _this.collapse="block";
      }
    }

    //  subject.close(); //zatvara socket
    subject.onclose = function(evt){
      console.log("Connection is terminated");
    }
  }

  reset(){
    this.metricsSelect.options.forEach((data: MatOption) => data.deselect());
    this.lossSelect.options.forEach((data: MatOption) => data.deselect());
  }

  toggleAllSelection(){
    this.metricsSelect.options.forEach( (item : MatOption) => {if(item.value.type == this.problemType)item.select()});
  }

  toggleAllDeselect(){
    this.metricsSelect.options.forEach( (item : MatOption) => {item.deselect()});
    
  }

  optionClick() {
    let newStatus = true;
    this.metricsSelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }  
}


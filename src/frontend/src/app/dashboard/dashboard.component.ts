import { Component, OnInit, ViewChild } from '@angular/core';
import { DatasetService } from '../training/services/dataset.service';
import { Router } from '@angular/router';
import { ShowTableComponent } from '../training/components/show-table/show-table.component';
import { LabelsComponent } from '../training/components/labels/labels.component';
import { Check, ModifiedData } from '../training/models/models';
import { HeadersService } from '../training/services/headers.service';
import { FormControl, Validators } from '@angular/forms';
import { TableIndicator } from '../training/components/show-table/show-table.component';
import { TrainingService } from '../training/services/training.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  datasetId:number;
  toggledButton: boolean = true
  numberOfEpochs: number = 4;
  corrMatrixSource: any;
  //visibilityTrigger: boolean = false;

  activationFunctionControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  activationFunctions: any[] = [
    {name: 'Sigmoid', info: 'Sigmoid!', codename: 'sigmoid'},
    {name: 'ReLu', info: 'ReLu!', codename: 'relu'},
    {name: 'Activation function2', info: 'Activation function2!', codename: 'function1'},
    {name: 'Activation function3', info: 'Activation function3!', codename: 'function2'},
  ];
  
  loaderDisplay:string = "none";
  containerVisibility:string = "hidden";
  nextButtonDisable:boolean = true;
  displayTableButtons:string = "block";
  datasetURL:string = "";
  statsTableDisplay:string = "none";
  deleteButtonDisplay:string = "inline";
  labelsVisibility:string = "visible";
  mainTableDisplay:string = "block";
  firstVisibility:string = "block";
  secondVisibility:string = "none";
  loaderMiniDisplay:string = "none";
  undoDisabled:boolean = true;
  undoDeletedDisabled:boolean = true;

  constructor(
    private datasetService: DatasetService, 
    private router: Router, 
    private headersService: HeadersService, 
    private trainingService: TrainingService, 
    private domSanitizer: DomSanitizer
    ) {
    this.datasetId = -1;
  }
   
  //@ViewChild(ShowTableComponent,{static: true}) private dataTable!: ShowTableComponent;
  @ViewChild('dataTable') private dataTable!: ShowTableComponent;
  @ViewChild('numIndicators') private numIndicators!: ShowTableComponent;
  @ViewChild('dataSetInformation') private dataSetInformation!: ShowTableComponent;
  @ViewChild('catIndicators') private catIndicators!: ShowTableComponent;
  @ViewChild('Labels') private labels!: LabelsComponent;

  public form: FormData = new FormData();
  
  public featuresLabel:any;
  //activateModal:boolean = false;

  req : any = {
    "public": true,
    "userID": 0,
    "description": "string",
    "name": "string",
    "datasetSource": "change me!",
    "delimiter": null,
    "lineTerminator": null,
    "quotechar": null,
    "escapechar": null,
    "encoding": null
  }   

  uploadObserver:any = {
    next: (response:any) => { 
      console.log("### next@uploadObserver")
      console.log(response)

      this.datasetId = response;

      this.datasetService.getData(this.datasetId).subscribe(this.fetchTableDataObserver);
    },
    error: (err: Error) => {
      console.log("### error@uploadObserver")
      console.log(err)
    }
  };

  fetchTableDataObserver:any = {
    next: (response:any) => { 
      
      this.showElements();

      console.log(response)
      
      var header = this.headersService.getDataHeader(response['columnTypes']);
      this.dataTable.prepareTable(TableIndicator.DATA_MANIPULATION,response['parsedDataset'], header);

      this.labels.onDatasetSelected(header);

      this.dataSetInformation.setPaginationEnabled(false);
      this.dataSetInformation.setTableStyle("height: 100px;");
      header = this.headersService.getInfoHeader(response['basicInfo']);
      this.dataSetInformation.prepareTable(TableIndicator.INFO, [response['basicInfo']], header) 

      // TODO ispraviti kada se omoguci povratak ID-a
      // this.dataSetInformation.changeAttributeValue("height: 100px;",undefined,undefined,undefined,false,1,false,false,true)
      // this.numIndicators.changeAttributeValue(undefined,undefined,undefined,undefined,false,undefined,undefined,undefined,true)
      // this.catIndicators.changeAttributeValue(undefined,undefined,undefined,undefined,false,undefined,undefined,undefined,true)
      
      this.datasetService.getStatIndicators(this.datasetId).subscribe(this.fetchStatsDataObserver);
      this.datasetService.getCorrMatrix(this.datasetId).subscribe(this.fetchCorrMatrixObserver);
    },
    error: (err: Error) => {
      console.log(err)

    }
  };
  fetchStatsDataObserver:any = {
    next: (response:any) => { 
        console.log("dashboard > DashboardComponent > fetchStatsDataObserver > next:")
        console.log(response)

        var headerContinuous = this.headersService.getInfoHeader(response['continuous']);
        this.numIndicators.setPaginationEnabled(false);
        this.numIndicators.setTableStyle("height: 400px;");
        this.numIndicators.prepareTable(TableIndicator.STATS, response['continuous'], headerContinuous) 

        var headerCategorical = this.headersService.getInfoHeader(response['categorical']);
        this.catIndicators.setPaginationEnabled(false);
        this.catIndicators.setTableStyle("height: 250px;");
        this.catIndicators.prepareTable(TableIndicator.STATS, response['categorical'], headerCategorical) 
        
    },
    error: (err: Error) => {
      console.log("dashboard > DashboardComponent > fetchStatsDataObserver > error:")
      console.log(err)
    }
  };

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
  fetchCorrMatrixObserver:any = {
    next: (response:any) => { 
        console.log("dashboard > DashboardComponent > fetchCorrMatrixObserver > next:")
        //console.log(response)
        this.corrMatrixSource = this.domSanitizer.bypassSecurityTrustUrl(response);
    },
    error: (err: Error) => {
      console.log("dashboard > DashboardComponent > fetchCorrMatrixObserver > error:")
      console.log(err)
    }
  };

  ngOnInit(): void {
  }

  hideElements()
  {
    this.loaderDisplay = "block";
    this.containerVisibility = "hidden";
    this.labelsVisibility = "hidden";
    this.nextButtonDisable = true;
  }

  showElements()
  {
    this.loaderDisplay = "none";
    this.containerVisibility = "visible";
    this.labelsVisibility = "visible";
    this.nextButtonDisable = false;
  }

  onFileSelected(event:Event)
  {
    this.hideElements();

    if (this.form.get('file')) this.form.delete('file');

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;


    if (fileList && fileList?.length > 0) {

      var file = fileList[0];

      this.form.append('file', file);
      this.datasetService.uploadDatasetFile(this.form)
        .subscribe(this.uploadObserver);
    }
  }

  onShowDataClick() {

    this.hideElements();

    if (this.datasetURL == null || this.datasetURL == "")
      console.log("problem: dataset-url");
    else {
      this.req["datasetSource"] = this.datasetURL
  
      this.datasetService.uploadDatasetFileWithLink(this.datasetURL).subscribe(this.uploadObserver);
    }
  }

  onRemoveSelected() 
  {
    this.dataTable.onRemoveSelected();
  }
  
  onApplyChanges()
  {
    var req:ModifiedData = new ModifiedData(this.datasetId, this.dataTable.editedCells, this.dataTable.deletedRows);

    console.log(req);
    this.datasetService.modifyDataset(req).subscribe(
      {
        next: (response:any) =>{
          console.log(response);
          }
      }
    )
  }

  enableUndo(indicator:boolean)
  {
    if (indicator) this.undoDisabled = false;
    else this.undoDisabled = true;
  }
  enableUndoDeleted(indicator:boolean)
  {
    if(indicator) this.undoDeletedDisabled = false;
    else this.undoDeletedDisabled = true;
  }
  onUndo()
  {
    this.dataTable.onUndo();
  }
  onUndoDeleted()
  {
    this.dataTable.onUndoDeleted();
  }
  toggleTables(event:any){
    
    if(this.toggledButton)
    {
      event.currentTarget.innerHTML = "Show table";
      this.statsTableDisplay = "block";
      this.deleteButtonDisplay = "none";
      this.labelsVisibility = "hidden";
      this.mainTableDisplay = "none";
    }
    else
    {
      event.currentTarget.innerHTML = "Show stats"
      this.statsTableDisplay = "none";
      this.deleteButtonDisplay = "inline";
      this.labelsVisibility = "visible";
      this.mainTableDisplay = "block";
    }
    this.toggledButton = !this.toggledButton
  }


  OnNextClick() {

    var temp = this.labels.getValues(); // Cuva se objekat sa odabranim feature-ima i labelom

    if (temp!.label.length > 0){
      this.featuresLabel = temp;
      console.log(this.featuresLabel);
      //Pokreni modal
      this.firstVisibility = "none";
      this.secondVisibility = "block";
      
    }
    else{
      alert("Nisi izabrao izlaz!");
    }
    

    //this.router.navigate(['/labels'], { state: this.dataTable.headers });

  }

  onSaveClick()
  {

  }
  
  changeColomnVisibility(checkChange: Check) {
    this.dataTable.changeColomnVisibility(checkChange.id.toString(), checkChange.visible);
  }

  changeCheckBox(checkChange: Check) {
    this.labels.changeCheckbox(checkChange)
  } 

  onSelectedLabel(data:{id:number,pred:number | null})
  {
    this.dataTable.changeLabelColumn(data);
  }
  change(value: number): void {
    console.log(value);
    this.numberOfEpochs = value;
  }

  TrainingClick(){
    //this.loaderDisplay = "block";
    //this.secondVisibility = "none";
    this.loaderMiniDisplay = "block";
    this.trainingService.sendDataForTraining({
      epochs: this.numberOfEpochs,
      activationFunction: this.activationFunctionControl.value.name,
      features: this.featuresLabel['features'],
      labels: this.featuresLabel['label']
    }).subscribe(this.startTrainingObserver);
    console.log("Features: "+ this.featuresLabel['features'][0]['name']+" label: "+ this.featuresLabel['label'][0]['name'])
    console.log("Poslato "+ this.numberOfEpochs + " i " + this.activationFunctionControl.value.name)
  }
}

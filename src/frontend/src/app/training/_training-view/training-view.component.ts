import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Check, ModifiedData, TableIndicator } from '../models/table_models';
import { HeadersService } from '../services/headers.service';
import { TrainingService } from '../services/training.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatasetService } from '../services/dataset.service';
import { LabelsComponent } from '../components/labels/labels.component';
import { ShowTableComponent } from '../components/show-table/show-table.component';

@Component({
  selector: 'app-training-view',
  templateUrl: './training-view.component.html',
  styleUrls: ['./training-view.component.css']
})
export class TrainingViewComponent implements OnInit {

  datasetId:number;
  toggledButton: boolean = true
  numberOfEpochs: number = 4;
  learningRate: number = 0.1;
  corrMatrixSource: any;
  metricsArrayToSend: any[] = [];
  //visibilityTrigger: boolean = false;

  loaderDisplay:string = "none";
  containerVisibility:string = "hidden";
  nextButtonDisable:boolean = true;
  backButtonDisable:boolean = true;
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
  fileUploadDisable:boolean = false;
  linkUploadDisable:boolean = false;

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

      //console.log(response)
      
      var headerDataTable = this.headersService.getDataHeader(response['columnTypes']);
      this.dataTable.prepareTable(TableIndicator.DATA_MANIPULATION,response['parsedDataset'], headerDataTable);

      this.labels.onDatasetSelected(headerDataTable);

      this.dataSetInformation.setPaginationEnabled(false);
      this.dataSetInformation.setTableStyle("height: 100px;");
      var headerInfo = this.headersService.getInfoHeader([response['basicInfo']]);
      this.dataSetInformation.prepareTable(TableIndicator.INFO, [response['basicInfo']], headerInfo) 
      
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
        //console.log(response)

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
    var req:ModifiedData = new ModifiedData(this.dataTable.editedCells, this.dataTable.deletedRows, this.dataTable.deletedCols);

    console.log(req);
    this.datasetService.modifyDataset(this.datasetId, req).subscribe(
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
      this.fileUploadDisable = this.linkUploadDisable = true;
    }
    else
    {
      event.currentTarget.innerHTML = "Show stats"
      this.statsTableDisplay = "none";
      this.deleteButtonDisplay = "inline";
      this.labelsVisibility = "visible";
      this.mainTableDisplay = "block";
      this.fileUploadDisable = this.linkUploadDisable  = false;
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
}

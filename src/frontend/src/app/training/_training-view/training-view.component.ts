import { Component, OnInit, ViewChild } from '@angular/core';
import { Check, HeaderDict, ModifiedData, TableIndicator } from '../models/table_models';
import { HeadersService } from '../services/headers.service';
import { DatasetService } from '../services/dataset.service';
import { LabelsComponent } from '../components/labels/labels.component';
import { ShowTableComponent } from '../components/show-table/show-table.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { StatsComponent } from '../components/stats/stats.component';
import { UploadComponent } from '../components/upload/upload.component';
import { ModifyDatasetComponent } from '../components/modify-dataset/modify-dataset.component';
import { JwtService } from 'src/app/core/services/jwt.service';

@Component({
  selector: 'app-training-view',
  templateUrl: './training-view.component.html',
  styleUrls: ['./training-view.component.css']
})
export class TrainingViewComponent implements OnInit {

  datasetId:number = -1;
  userId:number = 0;
  toggledButton: boolean = true
  numberOfEpochs: number = 4;
  learningRate: number = 0.1;
  corrMatrixSource: any;
  metricsArrayToSend: any[] = [];
  //visibilityTrigger: boolean = false;

  viewIndicator:View = View.UPLOAD;
  uploadDisplay:string = "block";
  loaderDisplay:string = "none";
  containerVisibility:string = "visible";
  nextButtonDisable:boolean = true;
  backButtonDisable:boolean = true;
  displayTableButtons:string = "block";
  datasetURL:string = "";
  statsTableDisplay:string = "none";
  deleteButtonDisplay:string = "inline";
  labelsDisplay:string = "block";
  mainTableDisplay:string = "block";
  firstVisibility:string = "none";
  secondDisplay:string = "none";
  loaderMiniDisplay:string = "none";
  navButtonsDisplay:string = "block";
  undoDisabled:boolean = true;
  undoDeletedDisabled:boolean = true;
  dialogTitle:string = "";
  dialogMessage:string = "";
  fileName?:string = "";
  basicInfo:string = "";
  modalDisplay:boolean = false;
  confirmation:boolean = false;
  columnEncodings: string[] = [];

  constructor(
    private datasetService: DatasetService, 
    private headersService: HeadersService,
    public dialog: MatDialog,
    private jwtService: JwtService) {}
   
  //@ViewChild(ShowTableComponent,{static: true}) private dataTable!: ShowTableComponent;
  @ViewChild('upload') private upload!:UploadComponent;
  @ViewChild('dataTable') private dataTable!: ShowTableComponent;
  @ViewChild('dataSetInformation') private dataSetInformation!: ShowTableComponent;
  @ViewChild('Labels') private labels!: LabelsComponent;
  @ViewChild('Stats') private stats!:StatsComponent;
  @ViewChild('modifyModal') private modifyModal!:ModifyDatasetComponent;

  public form: FormData = new FormData();
  
  colEncodings: string[] = [];
  public choosenInAndOutCols:any;
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

      this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
      this.fileName = this.upload.fileName;
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
      this.dataTable.prepareTable(TableIndicator.PREVIEW,response['parsedDataset'], headerDataTable);

      this.labels.onDatasetSelected(headerDataTable);
      this.stats.showInfo([response['basicInfo']]);
      
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
        this.stats.showTables(response);
   
    },
    error: (err: Error) => {
      console.log("dashboard > DashboardComponent > fetchStatsDataObserver > error:")
      console.log(err)
    }
  };

  fetchCorrMatrixObserver:any = {
    next: (response:any) => { 
        console.log("dashboard > DashboardComponent > fetchCorrMatrixObserver > next:")
        //console.log(response)
        this.stats.showMatrix(response);
        
    },
    error: (err: Error) => {
      console.log("dashboard > DashboardComponent > fetchCorrMatrixObserver > error:")
      console.log(err)
    }
  };

  ngOnInit(): void {
    var decodedToken = this.jwtService.getDecodedAccessToken();
    this.userId = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];
  }

  hideElements()
  {
    if (this.viewIndicator == View.UPLOAD) 
    {
      this.viewIndicator = View.PREVIEW;
      this.uploadDisplay = "none";
      
    }
    this.firstVisibility = "none";
    this.loaderDisplay = "block";
    //this.containerVisibility = "hidden";
    //this.labelsDisplay = "none";
    this.navButtonsDisplay = "none";
    this.nextButtonDisable = true;
  }

  showElements()
  {
    this.loaderDisplay = "none";
    this.firstVisibility = "block";
    //this.containerVisibility = "visible";
    if (this.statsTableDisplay == "block") this.labelsDisplay = "none";
    else this.labelsDisplay = "block";
    this.navButtonsDisplay = "block";
    this.nextButtonDisable = false;
    this.backButtonDisable = false;
  }

  onFileSelected(file:File)
  {
    this.hideElements();

    if (this.form.get('file')) this.form.delete('file');
    
    this.form.append('file', file);
      this.datasetService.uploadDatasetFile(this.form)
        .subscribe(this.uploadObserver);
  }

  onShowDataClick(datasetURL:string) {
    this.hideElements();

    if (datasetURL == null || datasetURL == "")
      console.log("problem: dataset-url");
    else {
      this.req["datasetSource"] = datasetURL
      
      this.datasetService.uploadDatasetFileWithLink(datasetURL).subscribe(this.uploadObserver);
    }
  }

  modalOpen(){
    this.modalDisplay = true;
  }

  toggleTables(event:any){
    
    if(this.toggledButton)
    {
      event.currentTarget.innerHTML = "Show table";
      this.statsTableDisplay = "block";
      this.labelsDisplay = "none";
      this.mainTableDisplay = "none";
    }
    else
    {
      event.currentTarget.innerHTML = "Show stats"
      this.statsTableDisplay = "none";
      this.labelsDisplay = "block";
      this.mainTableDisplay = "block";
    }
    this.toggledButton = !this.toggledButton
  }

  OnNextClick() {
    if (this.viewIndicator == View.UPLOAD)
    {
        this.uploadDisplay = "none";
        this.firstVisibility = "block";
        this.viewIndicator = View.PREVIEW;
        this.backButtonDisable = false;
    }
    else if (this.viewIndicator == View.PREVIEW)
    {
      var choosenInAndOutCols = this.labels.getChoosenCols(); 
      console.log("choosenInAndOutCols")
      console.log(choosenInAndOutCols)
      
      if (choosenInAndOutCols!.label! !== undefined ){
        this.choosenInAndOutCols = choosenInAndOutCols;
        
        //Pokreni modal
        this.firstVisibility = "none";
        this.secondDisplay = "block";
        this.viewIndicator = View.TRAINING;
      }
      else
      {
        this.dialogTitle = "Alert";
        this.dialogMessage = "You have to choose the label";

        this.dialog.open(DialogComponent,{
          data: { title: this.dialogTitle, message:this.dialogMessage },
        });
      }
    }
  }

  OnBackClick(){
    if (this.viewIndicator == View.PREVIEW)
    {
      this.firstVisibility = "none";
      this.uploadDisplay = "block";
      this.backButtonDisable = true;
      this.viewIndicator = View.UPLOAD;
    }
    else if(this.viewIndicator == View.TRAINING)
    {
      this.secondDisplay = "none";
      this.firstVisibility = "block";
      this.viewIndicator = View.PREVIEW;
    }
    
  }

  confirmationCancel()
  {
    this.confirmation = false;
  }
  
  confirmationSave(){
    this.confirmation = true;
  }

  OnModalClose()
  {
    this.modifyModal.refreshView();
  }

  OnModalSave()
  {
    this.modalDisplay = false;
    this.hideElements();
    var tempEdited: object[] = [];

    var req:ModifiedData = new ModifiedData(this.modifyModal.getEditedCells(), this.modifyModal.getDeletedRows(), this.modifyModal.getDeletedCols());

    req.edited.forEach(element =>{
      this.dataTable.rowData[element.row][this.dataTable.headers[element.col].name] = this.modifyModal.modifyTable.rowData[element.row][this.modifyModal.modifyTable.headers[element.col].name];
      tempEdited.push(this.dataTable.rowData[element.row]);
    });

    this.datasetService.modifyDataset(this.datasetId, req).subscribe(
      {
        next: (response:any) =>{
          var tempDeleted :object[] = [];
          req.deletedRows.forEach(element => {
            tempDeleted.push(this.dataTable.rowData[element])
            this.dataTable.rowData.splice(element,1);
          });
          
          this.dataTable.updateRows(tempEdited);
          this.dataTable.removeRows(tempDeleted);

          this.datasetService.getStatIndicators(this.datasetId).subscribe(this.fetchStatsDataObserver);
          this.datasetService.getCorrMatrix(this.datasetId).subscribe(this.fetchCorrMatrixObserver);
          this.showElements();

          //this.datasetService.getData(this.datasetId).subscribe(this.fetchTableDataObserver);
          }
      }
    )

  }

  changeColomnVisibility(checkChange: Check) {
    this.dataTable.changeColomnVisibility(checkChange.id.toString(), checkChange.visible);
  }

  changeCheckBox(checkChange: Check) {
    this.labels.changeCheckbox(checkChange)
  } 

  onSelectedTargetColumn(data:{id: number, pred: number | null})
  {
    this.dataTable.changeLabelColumn(data);
  }

  public downloadFile(){
    this.dataTable.downloadFile();
  }

  getSelectedEncoding() {
    return this.labels.selectedEncodings;
  }
  
}

enum View {
  UPLOAD,
  PREVIEW,
  TRAINING
}
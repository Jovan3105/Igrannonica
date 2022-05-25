import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Check, ChosenColumn, ModifiedData, TableIndicator } from '../models/table_models';
import { HeadersService } from '../services/headers.service';
import { DatasetService } from '../services/dataset.service';
import { LabelsComponent } from '../components/labels/labels.component';
import { ShowTableComponent } from '../components/show-table/show-table.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { StatsComponent } from '../components/stats/stats.component';
import { UploadComponent } from '../components/upload/upload.component';
import { ModifyDatasetComponent } from '../components/modify-dataset/modify-dataset.component';
import { SessionService } from 'src/app/core/services/session.service';
import { ColumnFillMethodPair } from '../models/dataset_models';
import { View, DisplayType } from '../../shared/models/navigation_models';
import { JwtService } from 'src/app/core/services/jwt.service';

@Component({
  selector: 'app-training-view',
  templateUrl: './training-view.component.html',
  styleUrls: ['./training-view.component.css']
})
export class TrainingViewComponent implements OnInit {

  /* ********************** */
  /* podaci */
  /* ****************************************************** */
  datasetId:number = -1;
  datasetURL:string = "";
  userId:number = 0;

  viewIndicator:View = View.UPLOAD;
  datasetSource: string = '';

  fileName:string = "";
  basicInfo:string = "";
  corrMatrixImgSource: any;
  numOfMissingValues:number = 0;
  missingIndicator:boolean = false;
  columnEncodings: string[] = [];

  dialogTitle:string = "";
  dialogMessage:string = "";
  errorMessage:string = "";

  metricsArrayToSend: any[] = [];
  
  public form: FormData = new FormData();
  public choosenInAndOutCols:any = undefined;
  
  /* ********************** */
  /* promenljive za display */
  /* ****************************************************** */
  loaderDisplay:string = DisplayType.HIDE;
  loaderMiniDisplay:string = DisplayType.HIDE;

  previewDisplay:string = DisplayType.HIDE;
  trainingDisplay:string = DisplayType.HIDE;
  uploadDisplay:string = DisplayType.SHOW_AS_BLOCK;

  navButtonsDisplay:string = DisplayType.SHOW_AS_BLOCK;

  mainContainerDisplay:string = DisplayType.SHOW_AS_FLEX;
  mainTableDisplay:string = DisplayType.SHOW_AS_BLOCK;
  statsTableDisplay:string = DisplayType.HIDE;
  labelsDisplay:string = DisplayType.SHOW_AS_BLOCK;

  deleteButtonDisplay:string = DisplayType.SHOW_AS_INLINE;

  /* ********************** */
  /* promenljive za disabled direktivu */
  /* ****************************************************** */
  undoDisabled:boolean = true;
  nextButtonDisable:boolean = true;
  backButtonDisable:boolean = true;

  undoDeletedDisabled:boolean = true;

  /* ********************** */
  /* promenljive za kontrolu prikaza (ngIF, typescript, ...) */
  /* ****************************************************** */
  modalDisplay:boolean = false;
  errorDisplay:boolean = false;
  confirmation:boolean = false;
  showColumnSelectionPage: boolean = true

  constructor(
    private datasetService: DatasetService, 
    private headersService: HeadersService,
    public dialog: MatDialog,
    private jwtService: JwtService,
    public sessionService:SessionService ) {
    }
   
  @ViewChild('upload') private upload!:UploadComponent;
  @ViewChild('dataTable') private dataTable!: ShowTableComponent;
  @ViewChild('dataSetInformation') private dataSetInformation!: ShowTableComponent;
  @ViewChild('columnsSelecion') private labels!: LabelsComponent;
  @ViewChild('Stats') private stats!:StatsComponent;
  @ViewChild('modifyModal') private modifyModal!:ModifyDatasetComponent;


  req : any = {
    "public": true,
    "userID": 0,
    "description": "string",
    "name": "string",
    "datasetSource": "TODO",
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
      /*
      this.sessionService.saveData('file_name',this.upload.fileName!);
      if (this.upload.fileSize != undefined)
        this.sessionService.saveData('file_size',this.upload.fileSize!);
      */
      this.sessionService.saveData('dataset_id',this.datasetId.toString());
      this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
      this.fileName = this.upload.fileName!;
      this.sessionService.saveData('file_name',this.fileName);
    },
    error: (err: Error) => {
      console.log("### error@uploadObserver")
      console.log(err.message)
      this.showUploadErrorMessage(err.message);
    }
  };

  fetchTableDataObserver:any = {
    next: (response:any) => { 
      if(this.viewIndicator != View.TRAINING)
        this.showElements();

      //console.log(response);
      //this.sessionService.saveData('table_data',JSON.stringify(response));
      var headerDataTable = this.headersService.getDataHeader(response['columnTypes']);
      this.dataTable.prepareTable(TableIndicator.PREVIEW,response['parsedDataset'], headerDataTable);

      this.labels.onDatasetSelected(headerDataTable, this.viewIndicator);
      this.stats.showInfo([response['basicInfo']]);
      this.numOfMissingValues = response['basicInfo']['missing'];
      this.missingIndicator = !this.missingIndicator;

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

  ngOnInit(): void 
  {
    var decodedToken = this.jwtService.getDecodedAccessToken();
    this.userId = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];
    
    let lastVisitedPage =  this.sessionService.getData('view');

    if (lastVisitedPage == null) {
      this.sessionService.saveData('view',this.viewIndicator.toString());
    }
    else  {
      this.viewIndicator = parseInt(lastVisitedPage);

      // TODO proveriti da li ovde treba da se odradi i loading ostalih podataka 
      // na datoj stranici

      if (this.viewIndicator == View.PREVIEW)
      {
        this.uploadDisplay = DisplayType.HIDE;
        this.showElements();
      }
      else if(this.viewIndicator == View.TRAINING)
      {
        this.uploadDisplay = DisplayType.HIDE;
        this.previewDisplay = DisplayType.HIDE;
        this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;
        this.nextButtonDisable = false;
        this.backButtonDisable = false;
      }
    }  
  }

  hideElements()
  {
    if (this.viewIndicator == View.UPLOAD) 
    {
      this.viewIndicator = View.PREVIEW;
      //this.sessionService.saveData('view',this.viewIndicator.toString());
      this.uploadDisplay = DisplayType.HIDE;
      
    }

    this.previewDisplay = DisplayType.HIDE;
    this.loaderDisplay = DisplayType.SHOW_AS_BLOCK;

    //this.labelsDisplay = DisplayType.HIDE;
    this.navButtonsDisplay = DisplayType.HIDE;
    this.nextButtonDisable = true;
  }

  showElements()
  {
    this.loaderDisplay = DisplayType.HIDE;
    this.previewDisplay = DisplayType.SHOW_AS_BLOCK;
    
    if (this.statsTableDisplay == DisplayType.SHOW_AS_BLOCK) this.labelsDisplay = DisplayType.HIDE;
    else this.labelsDisplay = DisplayType.SHOW_AS_BLOCK;
    this.navButtonsDisplay = DisplayType.SHOW_AS_BLOCK;
    this.nextButtonDisable = false;
    this.backButtonDisable = false;
  }

  showUploadErrorMessage(message:string)
  {
    this.errorMessage = message;
    this.loaderDisplay = DisplayType.HIDE;
    this.viewIndicator = View.UPLOAD;
    this.sessionService.saveData('view',this.viewIndicator.toString());
    this.uploadDisplay = DisplayType.SHOW_AS_BLOCK;
    this.navButtonsDisplay = DisplayType.SHOW_AS_BLOCK;
    this.errorDisplay = true;  
    setTimeout(() => {
      this.errorDisplay = false;
    }, 5000);

  }

  onDatasetSelection(obj: { isSelected: boolean, datasetSource: string }) {
    this.nextButtonDisable = !obj.isSelected;
    this.datasetSource = obj.datasetSource;
  }

  onFileSelected(file:File)
  {
    this.hideElements();

    const mData = JSON.stringify({
      Name: "aaaaa",
      Description: "bbbbb",
      Public: true
    });

    this.form.append("data",mData);

    if (this.form.get('file')) 
      this.form.delete('file');
    
    this.form.append('file', file);

    this.datasetService.uploadDatasetFile(this.form).subscribe(this.uploadObserver);
  }

  onShowDataClick(datasetURL:string) {
    this.hideElements();

    if (datasetURL == null || datasetURL == "")
      console.log("problem: dataset-url");
    else {
      this.req["datasetSource"] = datasetURL
      this.sessionService.saveData('upload_link', datasetURL);
      this.datasetService.uploadDatasetFileWithLink(datasetURL).subscribe(this.uploadObserver);
    }
  }

  toggleTables(event:any){
    if(this.showColumnSelectionPage)
    {
      event.currentTarget.innerHTML = "Show table";
      this.statsTableDisplay = DisplayType.SHOW_AS_BLOCK;
      //this.labelsDisplay = DisplayType.HIDE;
      //this.mainTableDisplay = DisplayType.HIDE;
      this.mainContainerDisplay = DisplayType.HIDE;
    }
    else
    {
      event.currentTarget.innerHTML = "Show stats"
      this.statsTableDisplay = DisplayType.HIDE;
      //this.labelsDisplay = DisplayType.SHOW_AS_BLOCK;
      //this.mainTableDisplay = DisplayType.SHOW_AS_BLOCK;
      this.mainContainerDisplay = DisplayType.SHOW_AS_FLEX;
    }
    this.showColumnSelectionPage = !this.showColumnSelectionPage
  }

  OnNextClick() {
    if (this.viewIndicator == View.UPLOAD)
    {
      if(this.datasetSource == 'link')
        this.upload.linkClick();
      else
        this.upload.uploadClick();

      //this.sessionService.saveData('view',this.viewIndicator.toString());
      this.backButtonDisable = false;
    }
    else if (this.viewIndicator == View.PREVIEW)
    {
      var choosenInAndOutCols = this.labels.getChoosenCols(); 
      console.log("choosenInAndOutCols")
      console.log(choosenInAndOutCols)
      
      if (choosenInAndOutCols?.label !== undefined || choosenInAndOutCols!.features.length > 0){
        if(choosenInAndOutCols!.features.length > 0)
        {
          if(choosenInAndOutCols!.label !== undefined)
          {
            this.choosenInAndOutCols = choosenInAndOutCols;

            if(this.numOfMissingValues == 0) {
              this.previewDisplay = DisplayType.HIDE;
              this.viewIndicator = View.TRAINING;
              this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;
            }
            else {
              let columnFillMethodPairs: ColumnFillMethodPair[] = []
              
              choosenInAndOutCols?.features.forEach(col => {
                let str_value: string = '';
                let num_value: number = 0;

                if(col.type == 'object')
                  str_value = col.missingConstant!;
                else
                  num_value = +col.missingConstant!;

                let columnFillMethodPair = new ColumnFillMethodPair(col.name, col.missing!, str_value, num_value)
                columnFillMethodPairs.push(columnFillMethodPair);
              });
              
              let label: ChosenColumn = choosenInAndOutCols?.label!;
              let str_value: string = '';
              let num_value: number = 0;

              if(label.type == 'object')
                str_value = label.missingConstant!;
              else
                num_value = +label.missingConstant!;

              let columnFillMethodPair = new ColumnFillMethodPair(label.name, label.missing!, str_value, num_value)
              columnFillMethodPairs.push(columnFillMethodPair);
             
              this.previewDisplay = DisplayType.HIDE;
              this.viewIndicator = View.TRAINING;
              this.loaderDisplay = DisplayType.SHOW_AS_BLOCK;

              this.datasetService.fillMissingValues(this.datasetId, columnFillMethodPairs).subscribe({
                next: (response:any) => { 
                  
                  this.sessionService.saveData('dataset_id',this.datasetId.toString());
                  this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
                  
                  this.fileName = this.upload.fileName!;
                  this.sessionService.saveData('file_name',this.fileName);

                  this.loaderDisplay = DisplayType.HIDE;
                  this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;

                  this.sessionService.saveData('chosen_columns', JSON.stringify(this.choosenInAndOutCols));
                },
                error: (err: Error) => {
                  console.log(err);
                  this.viewIndicator = View.PREVIEW;
                  this.loaderDisplay = DisplayType.HIDE;
                  this.previewDisplay = DisplayType.SHOW_AS_BLOCK;
                  // TODO error handling kada popunjavanje ne uspe
                }
              })
            }
          }
          else
          {
            this.dialogTitle = "Alert";
            this.dialogMessage = "You have to choose a target variable";
    
            this.dialog.open(DialogComponent,{
              data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
            });
          }
        }
        else
        {
          this.dialogTitle = "Alert";
          this.dialogMessage = "You have to choose at least one feature";

          this.dialog.open(DialogComponent,{
          data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
        });
        }
      }
      else
      {
        this.dialogTitle = "Alert";
        this.dialogMessage = "You have to choose at least one feature and a target variable";

        this.dialog.open(DialogComponent,{
          data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
        });
      }
    }
  }

  OnBackClick(){
    if (this.viewIndicator == View.PREVIEW)
    {
      this.previewDisplay = DisplayType.HIDE;
      this.uploadDisplay = DisplayType.SHOW_AS_BLOCK;
      this.backButtonDisable = true;
      this.viewIndicator = View.UPLOAD;
      this.sessionService.saveData('view', this.viewIndicator.toString());
    }
    else if(this.viewIndicator == View.TRAINING)
    {
      this.trainingDisplay = DisplayType.HIDE;
      this.previewDisplay = DisplayType.SHOW_AS_BLOCK;
      this.viewIndicator = View.PREVIEW;
      //this.sessionService.saveData('view', this.viewIndicator.toString());
    }
    
  }

  changePageView() {

  }

  confirmationCancel()
  {
    this.confirmation = false;
  }
  
  confirmationSave(){
    this.confirmation = true;
  }

  modalOpen(){
    this.modalDisplay = true;
  }

  OnModalClose()
  {
    this.modifyModal.refreshView();
    this.modalDisplay = false;
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

          //this.datasetService.getData(this.datasetId).subscribe(this.fetchTableDataObserver); // TODO check
          },
          error:(err: Error) => {
            console.log(err);
            // TODO error handling kada modify ne uspe
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

  onTargetColumnSelect(data:{id: number, previousTargetId: number | null})
  {
    this.dataTable.changeLabelColumn(data);
  }

  public downloadFile(){
    this.dataTable.downloadFile();
  }

  getSelectedEncoding() {
    return this.labels.selectedEncodings;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event:Event) {

    if(this.modalDisplay == true)
    {
    }
  }
}


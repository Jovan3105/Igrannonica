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
import { UserService } from 'src/app/core/services/user.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  userId:number = -1;

  viewIndicator:View = View.UPLOAD;
  datasetSource: string = '';

  fileName:string = "";
  basicInfo:string = "";
  corrMatrixImgSource: any;
  numOfMissingValues:number = 0;
  missingIndicator:boolean = false;
  linearStepper:boolean = true;
  columnEncodings: string[] = [];
  currentPage:number = 1;

  dialogTitle:string = "";
  dialogMessage:string = "";
  errorMessage:string = "";

  uploadCompleted:boolean = false;

  metricsArrayToSend: any[] = [];
  
  public form: FormData = new FormData();
  public choosenInAndOutCols:any = undefined;

  maxPages = Infinity;
  minPages = 1;
  formPages=new FormGroup({
    currentPage:new FormControl('1',[Validators.required])
  })
  maxPagesModiify = Infinity;
  formPagesModify=new FormGroup({
    currentPageModify:new FormControl('1',[Validators.required])
  })
  /* ********************** */
  /* promenljive za display */
  /* ****************************************************** */
  loaderDisplay:string = DisplayType.HIDE;
  loaderMiniDisplay:string = DisplayType.HIDE;

  stepperDisplay:string =DisplayType.SHOW_AS_BLOCK;
  previewDisplay:string = DisplayType.HIDE;
  trainingDisplay:string = DisplayType.HIDE;
  uploadDisplay:string = DisplayType.SHOW_AS_BLOCK;

  navButtonsDisplay:string = DisplayType.HIDE;

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
  modifyChangeButtons:boolean = false;

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
    private sessionService: SessionService,
    private authService: AuthService ) {
    }
   
  @ViewChild('upload') private upload!:UploadComponent;
  @ViewChild('dataTable') private dataTable!: ShowTableComponent;
  @ViewChild('dataSetInformation') private dataSetInformation!: ShowTableComponent;
  @ViewChild('columnsSelecion') private labels!: LabelsComponent;
  @ViewChild('Stats') private stats!:StatsComponent;
  @ViewChild('modifyModal') private modifyModal!:ModifyDatasetComponent;
  @ViewChild('modifyTable') private modifyTable!:ModifyDatasetComponent;


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

      if (this.datasetId != undefined)
      {
        this.uploadCompleted = true;
        this.sessionService.saveData('dataset_id',this.datasetId.toString());
        this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
        this.fileName = this.upload.name!;
        this.sessionService.saveData('file_name',this.fileName);
      }
      else
      {
        this.showUploadErrorMessage("There was problem while fetching data. Please try again later")
      }
      /*
      this.sessionService.saveData('file_name',this.upload.fileName!);
      if (this.upload.fileSize != undefined)
        this.sessionService.saveData('file_size',this.upload.fileSize!);
      */
    },
    error: (err: Error) => {
      console.log("### error@uploadObserver")
      //console.log(err.message)
      this.showUploadErrorMessage(err.message);
    }
  };

  fetchTableDataObserver:any = {
    next: (response:any) => { 
      this.showElements();
      //console.log(response);
      //this.sessionService.saveData('table_data',JSON.stringify(response));
      var headerDataTable = this.headersService.getDataHeader(response['columnTypes']);
      this.dataTable.prepareTable(TableIndicator.PREVIEW,response['parsedDataset'], headerDataTable);
      
      this.numOfMissingValues = response['basicInfo']['missing'];
      this.missingIndicator = !this.missingIndicator;

      this.labels.onDatasetSelected(headerDataTable);
      this.stats.showInfo([response['basicInfo']]);
      this.stats.showMissingValues([response['missingValues']]);

      this.datasetService.getStatIndicators(this.datasetId).subscribe(this.fetchStatsDataObserver);
      this.datasetService.getCorrMatrix(this.datasetId).subscribe(this.fetchCorrMatrixObserver);
    },
    error: (err: Error) => {
      console.log(err)
      this.showUploadErrorMessage(err.message);
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

    if(!decodedToken) {
      this.authService.logout('session_expired')
    }

    let userIdTemp = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber'];

    if(!userIdTemp) {
      this.authService.logout('session_expired')
    }

    this.userId = userIdTemp;

    this.sessionService.saveData('user_id', this.userId.toString());
    
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
    
    if (this.viewIndicator == View.UPLOAD) // TODO - cuvanje stanja
    {
      //this.viewIndicator = View.PREVIEW;
      //this.sessionService.saveData('view',this.viewIndicator.toString());
    }
    this.stepperDisplay = DisplayType.HIDE;
    this.loaderDisplay = DisplayType.SHOW_AS_BLOCK;
  }

  showElements()
  {

    this.loaderDisplay = DisplayType.HIDE;
    this.stepperDisplay = DisplayType.SHOW_AS_BLOCK;
    if (this.viewIndicator == View.UPLOAD) 
    {
      this.viewIndicator = View.PREVIEW;
      //this.sessionService.saveData('view',this.viewIndicator.toString());
    }
  }

  showUploadErrorMessage(message:string)
  {
    this.errorMessage = message;
    this.loaderDisplay = DisplayType.HIDE;
    this.viewIndicator = View.UPLOAD;
    this.stepperDisplay = DisplayType.SHOW_AS_BLOCK;
    this.sessionService.saveData('view',this.viewIndicator.toString());

    this.errorDisplay = true;  
    setTimeout(() => {
      this.errorDisplay = false;
    }, 5000);

  }

  onDatasetSelection(obj: { isSelected: boolean, datasetSource: string }) {
    this.nextButtonDisable = !obj.isSelected;
    this.datasetSource = obj.datasetSource;
  }

  onFileSelected($event:any)
  {
    if ($event == undefined) {
      this.viewIndicator = View.PREVIEW;
      return;
    }
    this.hideElements();

    const datasetInfo = JSON.stringify({
      Name: $event.name,
      Description: $event.description,
      Public: $event.public
    });

    if (this.form.get('data')) 
      this.form.delete('data');
    this.form.append("data",datasetInfo);

    if (this.form.get('file')) 
      this.form.delete('file');
    
    this.form.append('file', $event.file);

    this.datasetService.uploadDatasetFile(this.form).subscribe(this.uploadObserver);
  }

  onShowDataClick(datasetURL:string) {

    if (datasetURL == undefined) {
      this.viewIndicator = View.PREVIEW;
      return;
    }

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
      this.mainContainerDisplay = DisplayType.HIDE;
    }
    else
    {
      event.currentTarget.innerHTML = "Show stats"
      this.statsTableDisplay = DisplayType.HIDE;
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
  changeModifyButtons(value:boolean)
  {
    this.modifyChangeButtons = value;
  }
  confirmationCancel()
  {
    this.confirmation = false;
  }
  
  confirmationSave(){
    this.confirmation = true;
  }

  modalOpen(){
    this.currentPage = this.dataTable.getCurrentPage();;
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
  setIndex(event:StepperSelectionEvent)
  {
    this.viewIndicator = event.selectedIndex;

    if (event.selectedIndex == View.TRAINING)
    {
      var choosenInAndOutCols = this.labels.getChoosenCols(); 
      console.log("choosenInAndOutCols")
      console.log(choosenInAndOutCols)
      
      if (choosenInAndOutCols?.label !== undefined || choosenInAndOutCols!.features.length > 0)
      {
        if(choosenInAndOutCols!.features.length > 0)
        {
          if(choosenInAndOutCols!.label !== undefined)
          {
            this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;
            this.choosenInAndOutCols = choosenInAndOutCols;

            if(this.numOfMissingValues == 0) {
              //this.previewDisplay = DisplayType.HIDE;
              //this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;
            }
            else {
              let columnFillMethodPairs: ColumnFillMethodPair[] = []
              
              choosenInAndOutCols?.features.forEach(col => {
                let str_value: string = '';
                let num_value: number = 0;

                if(col.type == 'Categorical')
                {
                  str_value = col.missingConstant!;
                  console.log(col.missingConstant);
                }
                else
                  num_value = +col.missingConstant!;

                let columnFillMethodPair = new ColumnFillMethodPair(col.name, col.missing!, str_value, num_value)
                columnFillMethodPairs.push(columnFillMethodPair);
              });
              
              if(choosenInAndOutCols?.label) {
                let label: ChosenColumn = choosenInAndOutCols?.label;
                let str_value: string = '';
                let num_value: number = 0;

                if(label.type == 'Categorical')
                  str_value = label.missingConstant!;
                else
                  num_value = +label.missingConstant!;

                let columnFillMethodPair = new ColumnFillMethodPair(label.name, label.missing!, str_value, num_value)
                columnFillMethodPairs.push(columnFillMethodPair);
              }
              console.log(columnFillMethodPairs);
              this.hideElements(); 
              this.datasetService.fillMissingValues(this.datasetId, columnFillMethodPairs).subscribe({
                next: (response:any) => {
                  console.log("Fill missing value: ", response)
                  this.viewIndicator = View.TRAINING;
                  this.labels.keep_state = true;
                  this.sessionService.saveData('dataset_id',this.datasetId.toString());
                  this.datasetService.getData(this.datasetId, this.userId).subscribe(this.fetchTableDataObserver);
                  this.fileName = this.upload.fileName!;
                  this.sessionService.saveData('file_name',this.fileName);
                  this.previewDisplay = DisplayType.HIDE;
                  this.trainingDisplay = DisplayType.SHOW_AS_BLOCK;

                  this.sessionService.saveData('chosen_columns', JSON.stringify(this.choosenInAndOutCols));
                },
                error: (err: Error) => {
                  console.log(err);
                  this.showUploadErrorMessage(err.message);
                  // TODO error handling kada popunjavanje ne uspe
                }
              })
            }
          }
          else
          {
            this.dialogTitle = "Alert";
            this.dialogMessage = "You have to choose a target variable";
    
            const dialogRef = this.dialog.open(DialogComponent,{
              data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
            });
            dialogRef.afterClosed().subscribe(result => {
              this.setView(View.PREVIEW);
              console.log(this.viewIndicator);
            });
            
          }
        }
        else
        {
          this.dialogTitle = "Alert";
          this.dialogMessage = "You have to choose at least one feature";

          const dialogRef = this.dialog.open(DialogComponent,{
            data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
          });
          dialogRef.afterClosed().subscribe(result => {
            this.setView(View.PREVIEW);
          });
        }
      }
      else
      {
        this.dialogTitle = "Alert";
        this.dialogMessage = "You have to choose at least one feature and a target variable";

        const dialogRef = this.dialog.open(DialogComponent,{
          data: { title: this.dialogTitle, message:this.dialogMessage, input:false },
        });
        dialogRef.afterClosed().subscribe(result => {
          this.setView(View.PREVIEW);
        });
      }
    }
    //this.viewIndicator = index;
    //this.sessionService.saveData('tab_index',this.tab_index.toString());
  }

  setView(view:View)
  {
    this.viewIndicator = view;
  }
  public changePage(event: any){
    if(event>this.maxPages){
      this.formPages.controls['currentPage'].setValue(this.maxPages);
    }
    else if(event<this.minPages){
      this.formPages.controls['currentPage'].setValue(this.minPages);
    }
    this.dataTable.setCurrentPage(this.formPages.get('currentPage')!.value-1)
    //console.log(this.maxPages+" "+ this.minPages)
  }
  public changePageModify(event: any){
    if(event>this.maxPagesModiify){
      this.formPagesModify.controls['currentPageModify'].setValue(this.maxPagesModiify);
    }
    else if(event<1){
      this.formPagesModify.controls['currentPageModify'].setValue(1);
    }
    this.modifyModal.setCurrentPage(this.formPagesModify.get('currentPageModify')!.value-1)
    //console.log(this.maxPages+" "+ this.minPages)
  }

}


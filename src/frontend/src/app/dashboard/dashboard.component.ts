import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DatasetService } from '../training/services/dataset.service';
import { ShowTableComponent } from '../training/components/show-table/show-table.component';
import { style } from '@angular/animations';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  toggledButton: boolean = true
  
  constructor(private datasetService: DatasetService) { }
  //@ViewChild(ShowTableComponent,{static: true}) private dataTable!: ShowTableComponent;
  @ViewChild('dataTable') private dataTable!: ShowTableComponent;
  @ViewChild('numIndicators') private numIndicators!: ShowTableComponent;
  @ViewChild('dataSetInformation') private dataSetInformation!: ShowTableComponent;
  @ViewChild('catIndicators') private catIndicators!: ShowTableComponent;

  public form:FormData = new FormData();
  fetchTableDataObserver:any = {
    next: (response:any) => { 
      console.log("Gotovo1")
        console.log(response)
        console.log(response['basicInfo'])
        this.dataTable.prepareTable(response['parsedDataset'])
        this.dataSetInformation.prepareTable([response['basicInfo']])

        this.dataSetInformation.columnDefs.forEach(element => {
          element['editable'] = false;
          element['resizable'] = false;
        });
        
        this.dataSetInformation.changeAttributeValue("height: 100px;",undefined,undefined,undefined,false,1,false,false,true)
        this.numIndicators.changeAttributeValue(undefined,undefined,undefined,undefined,false,undefined,undefined,undefined,true)
        this.catIndicators.changeAttributeValue(undefined,undefined,undefined,undefined,false,undefined,undefined,undefined,true)
        
        this.datasetService.getStatIndicators(2).subscribe(this.fetchStatsDataObserver);
        var buttons = document.getElementById('buttons')
        buttons!.style.display = "block";
    },
    error: (err: Error) => {
      console.log(err)

    }
  };
  fetchStatsDataObserver:any = {
    next: (response:any) => { 
      console.log("Gotovo2")
        console.log(response)

        this.numIndicators.prepareTable(response['continuous'])
        this.numIndicators.columnDefs.forEach(element => {
          element['editable'] = false;
          element['resizable'] = false;
        });

        this.catIndicators.prepareTable(response['categorical'])
        this.catIndicators.columnDefs.forEach(element => {
          element['editable'] = false;
          element['resizable'] = false;
        });
        
        
    },
    error: (err: Error) => {
      console.log(err)

    }
  };
  ngOnInit(): void {
  }
  onFileSelected(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    

    if (fileList && fileList?.length > 0) 
    {
      
      var file = fileList[0];
     
      this.form.append('file', file);
      
      this.datasetService.uploadDataset(this.form)
      .subscribe(this.fetchTableDataObserver);
    }
  }

  
  onRemoveSelected(){
    this.dataTable.onRemoveSelected();
  }
  onShowDataClick() {
    
    var datasetURL = (<HTMLInputElement>document.getElementById('dataset-url'));
    if( datasetURL == null || datasetURL.value == "")
      console.log("problem: dataset-url");
    else {
      var req = {
        "public": true,
        "userID": 0,
        "description": "string",
        "name": "string",
        "datasetSource": datasetURL.value,
        "delimiter": null,
        "lineTerminator": null,
        "quotechar": null,
        "escapechar": null,
        "encoding": null
      }

      

      this.datasetService.parseDataset(req).subscribe(this.fetchTableDataObserver);
      
    }

    
  }

  toggleTables(){
    var numbericalTable = document.getElementById('numerical');
    var mainTable = document.getElementById('mainTable');
    var basicTable = document.getElementById('basicInfo');
    var statsButton = document.getElementById('statsButton');
    var deleteButton = document.getElementById('deleteButton');
    var categoricalTable = document.getElementById('categorical');
    if(this.toggledButton){
      numbericalTable!.style.display = "block"
      basicTable!.style.display = "block"
      mainTable!.style.display = "none"
      categoricalTable!.style.display = "block"
      statsButton!.innerHTML = "Show table"
      deleteButton!.style.display = "none";
    }
    else{
      numbericalTable!.style.display = "none"
      basicTable!.style.display = "none"
      mainTable!.style.display = "block"
      categoricalTable!.style.display = "none"
      statsButton!.innerHTML = "Show stats"
      deleteButton!.style.display = "inline-block";
    }
    this.toggledButton = !this.toggledButton
  }
  
}

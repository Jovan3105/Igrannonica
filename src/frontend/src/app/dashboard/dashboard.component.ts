import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DatasetService } from '../training/services/dataset.service';
import { ShowTableComponent } from '../training/components/show-table/show-table.component';
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
  @ViewChild('catIndicators') private catIndicators!: ShowTableComponent;

  public form:FormData = new FormData();
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
      .subscribe({
        next: (response:any) => { 
          console.log("Dataset je upload-ovan"); 
          this.dataTable.prepareTable(response['parsedDataset'])
          var buttons = document.getElementById('buttons')
          buttons!.style.display = "block";
        },
        error: (e) => console.error(e)
      });
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

      const fetchTableDataObserver = {
        next: (response:any) => { 
          console.log("Gotovo1")
            console.log(response)
            this.dataTable.prepareTable(response['parsedDataset'])
            this.datasetService.getStatIndicators(2).subscribe(fetchStatsDataObserver);
            var buttons = document.getElementById('buttons')
            buttons!.style.display = "block";
        },
        error: (err: Error) => {
          console.log(err)
  
        }
      };
      const fetchStatsDataObserver = {
        next: (response:any) => { 
          console.log("Gotovo2")
            console.log(response)
            this.numIndicators.prepareTable(response['continuous'])
        },
        error: (err: Error) => {
          console.log(err)
  
        }
      };

      this.datasetService.parseDataset(req).subscribe(fetchTableDataObserver);
      
    }

    
  }

  toggleTables(){
    var statsTable = document.getElementById('numerical');
    var mainTable = document.getElementById('mainTable');
    var statsButton = document.getElementById('statsButton');
    var deleteButton = document.getElementById('deleteButton');
    if(this.toggledButton){
      statsTable!.style.display = "block"
      mainTable!.style.display = "none"
      statsButton!.innerHTML = "Show table"
      deleteButton!.style.display = "none";
    }
    else{
      statsTable!.style.display = "none"
      mainTable!.style.display = "block"
      statsButton!.innerHTML = "Show stats"
      deleteButton!.style.display = "inline-block";
    }
    this.toggledButton = !this.toggledButton
  }
  
}

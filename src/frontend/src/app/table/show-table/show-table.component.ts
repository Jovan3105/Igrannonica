import { Component, OnInit } from '@angular/core';
import { ColDef,GridApi,GridReadyEvent,CellValueChangedEvent } from 'ag-grid-community';
import { DatasetService } from '../services/dataset.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {

  headers:any[] = [];
  data:any = null;
  private gridApi!: GridApi;
  private insertForm?:FormData;

  constructor(private datasetService: DatasetService) { }

  dataSetList$!:Observable<any[]>;

  columnDefs: ColDef[] = [];
  rowData:any = [];
  public rowSelection = 'multiple';
  public paginationPageSize = 10;

  ngOnInit(): void {}

    
  onFileSelected(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    

    if (fileList && fileList?.length > 0) 
    {
      var file = fileList[0];
      var form = new FormData();
      form.append('file', file);

      this.datasetService.uploadDataset(form).subscribe({
        error: (e) => console.error(e),
        complete: () => this.getDataset()
      });
      /*
      var parseResult : ParseResult = this.papa.parse(file,{
        header: true,
        skipEmptyLines:true,
        //download:true,
        complete: (results) =>
        {
          this.data = results.data
          this.prepareTable()
        }
      });*/
    }
  }

  //Hardcodovano za sad, ova metoda ce prihvatati id koji se vraca u responsu upload-a
  getDataset()
  {
    this.datasetService.getData(10).subscribe(
      {
        next: (res) => this.prepareTable(res)
      }
    );
  }

  prepareTable(data:any)
  {
    this.data = data;

    if (data.length > 0) this.headers = Object.getOwnPropertyNames(data[0]); 
    this.columnDefs = [];
    this.rowData = [];
    for(let header of this.headers)
    {
      var col = {
        flex: 1,
        field: header,
        sortable: true,
        filter: true,
        editable: true,
        resizable:true,
        minWidth: 100
      }
      this.columnDefs.push(col);
    }

    for(let row of data)
    {
      this.rowData.push(row);
    }
    
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.applyTransaction({ remove: selectedData })!;
    
    for(let sData of selectedData)
    {
      var index = this.data.indexOf(sData,0);
      if (index != -1) this.data.splice(index,1);
    }
    //console.log(this.data)
  }
}

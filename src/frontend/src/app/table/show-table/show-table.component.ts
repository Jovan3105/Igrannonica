import { Component, OnInit } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
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

  constructor(private papa:Papa, private datasetService: DatasetService) { }

  dataSetList$!:Observable<any[]>;

  columnDefs: ColDef[] = [];
  rowData:any = [];
  public rowSelection = 'multiple';
  public paginationPageSize = 10;

  ngOnInit(): void 
  {
    this.dataSetList$ = this.datasetService.getDatasets();
  }

  onFileSelected(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    
    if (fileList && fileList?.length > 0) 
    {
      var file = fileList[0];
      var parseResult : ParseResult = this.papa.parse(file,{
        header: true,
        skipEmptyLines:true,
        //download:true,
        complete: (results) =>
        {
          this.data = results.data
          this.prepareTable()
        }
      });
    }
  }

  prepareTable()
  {
    if (this.data.length > 0) this.headers = Object.getOwnPropertyNames(this.data[0]); 
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

    for(let row of this.data)
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
  }
}

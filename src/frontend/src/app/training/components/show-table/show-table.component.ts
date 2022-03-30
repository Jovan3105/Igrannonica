import { Component, OnInit } from '@angular/core';
import { ColDef,GridApi,GridReadyEvent,CellValueChangedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {

  headers:any[] = [];
  data:any = null;
  private gridApi!: GridApi;

  constructor() { }

  columnDefs: ColDef[] = [];
  rowData:any = [];
  public rowSelection = 'multiple';
  public paginationPageSize = 10;

  public form:FormData = new FormData();

  ngOnInit(): void {
    
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
        filter: 'agTextColumnFilter',
        floatingFilter: true,
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
  }
}

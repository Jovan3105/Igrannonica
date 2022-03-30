import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent, ColumnApi, Column, ColumnVisibleEvent, CellStyle } from 'ag-grid-community';
import { Check, HeaderDict } from '../../models/check';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {

  headers: Array<HeaderDict> = [];
  data: any = null;
  private gridApi!: GridApi;
  private columnApi!: ColumnApi;
  @Output() hideEvent = new EventEmitter<Check>();

  constructor() { }

  columnDefs: ColDef[] = [];
  rowData: any = [];
  public rowSelection = 'multiple';
  public paginationPageSize = 10;

  public form: FormData = new FormData();

  ngOnInit(): void {

  }

  prepareTable(data: any, headers: Array<HeaderDict>) {
    this.data = data;

    if (data.length > 0) this.headers = headers;
    this.columnDefs = [];
    this.rowData = [];
    var index = 0;
    for (let header of this.headers) {
      var col = {
        colId: header.key.toString(),
        flex: 1,
        field: header.name,
        sortable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        editable: true,
        resizable: true,
        minWidth: 100,
        hide:false
      }
      this.columnDefs.push(col);
      index++;
    }

    for (let row of data) {
      this.rowData.push(row);
    }

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.applyTransaction({ remove: selectedData })!;

    for (let sData of selectedData) {
      var index = this.data.indexOf(sData, 0);
      console.log(index);
      if (index != -1) this.data.splice(index, 1);
    }
  }

  changeColomnVisibility(id: string, visible: boolean) {
    this.columnApi.setColumnVisible(id, visible);
  }

  onColumnVisible(e: ColumnVisibleEvent) {

    if (e.source != "api") {
      if (e.visible == false) {
        this.hideEvent.emit(new Check(e.columns![0].getInstanceId(), false));
      }
      else {
        this.hideEvent.emit(new Check(e.columns![0].getInstanceId(), true));
      }
      //console.log('Event Column Visible', e);
    }


  }

  changeLabelColumn(data:{id:number,pred:number}){
    
  /*
    var colDef1 = this.columnApi.getColumn(data.id)?.getColDef();
    var colDef2 = this.columnApi.getColumn(data.pred)?.getColDef();

    if (colDef1){
      colDef1.lockPosition = true;
    }
    if (colDef2) colDef2.lockPosition = false;

    this.columnApi.getColumn(data.id)?.setColDef(colDef1!,null!);
    this.columnApi.getColumn(data.pred)?.setColDef(colDef2!,null!);
    this.gridApi.refreshCells();
    */
  }
}

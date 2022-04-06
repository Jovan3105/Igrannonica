import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent, ColumnApi, ColumnVisibleEvent, CellStyle } from 'ag-grid-community';
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
  colIds:string[];
  @Output() hideEvent; //Event koji se podize kad se nesto sakrije iz tabele

  indicator?:TableIndicator;

  columnDefs: ColDef[] = [];
  rowData: any = [];
  public rowSelection = 'multiple';
  public paginationPageSize = 10;
  tableStyle:string = "height: 520px;"
  tableClass:string = "ag-theme-alpine"
  paginationEnabled:boolean = true
  animateRowsEnabled:boolean = true
  moveAnimationEnabled:boolean = false
  suppressDragLeaveHidesColumnsEnabled:boolean = false

  constructor() {
    this.columnDefs = [];
    this.rowData = [];
    this.rowSelection = 'multiple';
    this.paginationPageSize = 10;
    this.tableStyle = "height: 520px;";
    this.tableClass = "ag-theme-alpine";
    this.paginationEnabled = true;
    this.moveAnimationEnabled = false;
    this.animateRowsEnabled = true;
    this.suppressDragLeaveHidesColumnsEnabled = false;
    this.colIds = [];
    this.hideEvent = new EventEmitter<Check>();
  }

  ngOnInit(): void {

  }

  prepareTable(indicator:TableIndicator, data: any, headers: Array<HeaderDict>) {
    
    this.data = data;
    this.indicator = indicator;

    if (data.length > 0) this.headers = headers;
    this.columnDefs = [];
    this.rowData = [];

    this.setColumnDefs(indicator);
    
    for (let row of data) {
      this.rowData.push(row);
    }
    this.resetVisibility();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    console.log(this.columnDefs[0].field);
    if (this.indicator && this.indicator == TableIndicator.STATS && this.columnDefs[0].field != "indicator")
    {
      var ind = this.columnDefs.find(element => element.field == "indicator")
      if (ind)
        this.moveColumn(ind?.colId!);
    }
  }

  resetVisibility()
  {
    if(this.columnApi)
      this.columnApi.setColumnsVisible(this.colIds,true);
  }

  setRowData(rowData:any[]){
    this.rowData = rowData;
  }
  
  setColumnDefs(indicator:TableIndicator)
  {
    this.colIds = [];
    if (indicator == TableIndicator.DATA_MANIPULATION)
    {
      for (let header of this.headers) 
      {
        this.colIds.push(header.key.toString());
        var col = {
          colId: header.key.toString(),
          flex: 1,
          field: header.name,
          filter: 'agTextColumnFilter',
          floatingFilter: true,
          editable: true,
          resizable: true,
          sortable: true,
          minWidth: 100,
          lockVisible:false
        }
        this.columnDefs.push(col);
      }
    }
    else if (indicator == TableIndicator.INFO || indicator == TableIndicator.STATS)
    {
      for (let header of this.headers) 
      {
        //this.colIds.push(header.key.toString()); 
        var col2 = {
          colId: header.key.toString(),
          flex: 1,
          field: header.name,
          resizable: true,
          sortable: true,
          minWidth: 50,
          lockPosition:true
        }
        this.columnDefs.push(col2);
      }
    }
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

  //Kada se promeni u checkboxu, mora da se prikaze ili sakrije i u tabeli
  changeColomnVisibility(id: string, visible: boolean) {
    this.columnApi.setColumnVisible(id, visible);
  }

  moveColumn(key:string) {
    this.columnApi.moveColumn(key, 0);
  }
  //Salje obavestenje Label komponenti ukoliko se dragguje kolona iz tabele, da se to azurira i na checkbox-u

  onColumnVisible(e: ColumnVisibleEvent) {

    if (e.source == "uiColumnDragged") {
      if (e.visible == false) {
        this.hideEvent.emit(new Check(parseInt(e.columns![0].getColId()), false));
      }
      else {
        this.hideEvent.emit(new Check(parseInt(e.columns![0].getColId()), true));
      }
      console.log('Event Column Visible', e);
    }
  }
  
  setTableStyle(style:string)
  {
    this.tableStyle = style;
  }
  setPaginationEnabled(paginationEnabled:boolean)
  {
    this.paginationEnabled = paginationEnabled;
  }

  setPaginationPageSize(paginationPageSize:number){
    this.paginationPageSize = paginationPageSize;
  }

  changeAttributeValue(
    style?:string,
    tableClass?:string,
    rowData?:any[],
    columnDefs?:any[],
    paginationEnabled?:boolean,
    paginationPageSize?:number,
    animateRowsEnabled?:boolean,
    moveAnimationEnabled?:boolean,
    suppressDragLeaveHidesColumnsEnabled?:boolean
    )
  {
   if(style !== undefined){
     this.tableStyle = style
   }
    if(tableClass !== undefined){
      this.tableClass = tableClass
    } 
    if(rowData !== undefined){
      this.rowData = rowData
    } 
    if(columnDefs !== undefined){
      this.columnDefs = columnDefs
    } 
    if(paginationEnabled !== undefined){
      this.paginationEnabled = paginationEnabled
    } 
    if(animateRowsEnabled !== undefined){
      this.animateRowsEnabled = animateRowsEnabled
    } 
    if(paginationPageSize !== undefined){
      this.paginationPageSize = paginationPageSize
    } 
    if(moveAnimationEnabled !== undefined){
      this.moveAnimationEnabled = moveAnimationEnabled
    }
    if(suppressDragLeaveHidesColumnsEnabled !== undefined){
      this.suppressDragLeaveHidesColumnsEnabled = suppressDragLeaveHidesColumnsEnabled
    }

  }

  //Lock-uje kolonu koja je odabrana za label tako da ne moze da se hide-uje iz tabele
  changeLabelColumn(data:{id:number,pred:number | null }){

    console.log(data);
    if (data.pred != null)
    {
      this.columnDefs.forEach(element=>{
        if (element.colId == data.id.toString())
        {
          element.lockVisible  = true;

        }
        else if (element.colId == data.pred!.toString()){
          element.lockVisible  = false;
        }
      });
    }
    else
    {
      this.columnDefs.forEach(element=>{
        if (element.colId == data.id.toString())
        {
          element.lockVisible  = true;
        }
      });
    }

    this.changeColomnVisibility(data.id.toString(),true);
    console.log(this.columnDefs);
    this.gridApi.setColumnDefs(this.columnDefs);
  }
}

export enum TableIndicator {
  DATA_MANIPULATION,
  INFO,
  STATS
}

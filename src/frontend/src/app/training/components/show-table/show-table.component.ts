import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent, ColumnApi, ColumnVisibleEvent, CellStyle } from 'ag-grid-community';
import { Check, EditedCell, HeaderDict } from '../../models/models';
import { TableService } from '../../services/table.service';

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
  private colIds:string[];
  private tempDeleted:any[];

  editedCells:EditedCell[];
  deletedRows:number[];
  @Output() hideEvent; //Event koji se podize kad se nesto sakrije iz tabele
  @Output() undoEvent; //event koji se dize kada treba dis/enable undo dugme
  @Output() deleteEvent; //event koji se dize kada treba dis/enable undo deleted dugme

  columnDefs: ColDef[] = [];
  rowData: any = [];
  public rowSelection;
  public paginationPageSize;
  tableStyle:string;
  tableClass:string;
  paginationEnabled:boolean;
  animateRowsEnabled:boolean;
  moveAnimationEnabled:boolean;
  suppressDragLeaveHidesColumnsEnabled:boolean;
  undoRedoCellEditing:boolean;
  undoRedoCellEditingLimit:number;
  enableCellChangeFlash:boolean ;

  constructor(private tableService:TableService) {
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
    this.undoRedoCellEditing = true;
    this.undoRedoCellEditingLimit = 20;
    this.enableCellChangeFlash = true;
    this.colIds = [];
    this.deletedRows = [];
    this.editedCells = [];
    this.tempDeleted = [];
    this.hideEvent = new EventEmitter<Check>();
    this.undoEvent = new EventEmitter<boolean>();
    this.deleteEvent = new EventEmitter<boolean>();
  }

  ngOnInit(): void 
  {

  }

  prepareTable(indicator:TableIndicator, data: any, headers: Array<HeaderDict>) {
    
    this.data = data;
    this.headers = headers;

    this.columnDefs = [];
    this.rowData = [];

    if(indicator == TableIndicator.DATA_MANIPULATION)
    {
      this.deletedRows = [];
      this.editedCells = [];
    }

    this.setColumnDefs(indicator);
    
    for (let row of data) {
      this.rowData.push({... row});
    }
    this.resetVisibility();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  onCellValueChanged(params:CellValueChangedEvent)
  {
    console.log(params.node);  
    var editedCellIndex;
    var row = parseInt(params.node.id!);
    var colId = parseInt(params.column.getColId());

    var newValue = this.tableService.onCellValueChanged(params,this.rowData,this.headers);

    if (newValue != undefined)
    {
      if ((editedCellIndex = this.editedCells.findIndex(element => element.col == colId && element.row == row)) != -1)
      {
        console.log(row);
        if (this.data[row][this.headers[colId].name] == newValue) //provera da se ne salje originalna vrednost za izmenu
        { 
          this.editedCells.splice(editedCellIndex,1);
        }
        else 
          this.editedCells[editedCellIndex].value = newValue;

      }
      else 
        this.editedCells.push(new EditedCell(row,colId,newValue));
    }
    
    console.log(this.editedCells);
    if(this.gridApi.getCurrentUndoSize()) 
    {
      //console.log("Ima nesto za menjanje");
      this.undoEvent.emit(true);
    }
    else this.undoEvent.emit(false);
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
    else if (indicator == TableIndicator.INFO)
    {
      for (let header of this.headers) 
      {
        this.colIds.push(header.key.toString()); 
        var col2 = {
          colId: header.key.toString(),
          flex: 1,
          field: header.name,
          resizable: true,
          sortable: true,
          minWidth: 100,
          lockPosition:true
        }
        this.columnDefs.push(col2);
      }
    }
  }
  
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    this.tempDeleted = selectedData;
    const res = this.gridApi.applyTransaction({ remove: selectedData });

    for (let sData of selectedData) 
    {
      var index = this.rowData.indexOf(sData, 0);
      this.deletedRows.push(index);
    }

    console.log(this.deletedRows);
    console.log(this.rowData);
    if (this.deletedRows.length) this.deleteEvent.emit(true);
    else this.deleteEvent.emit(false);
  }

  onUndo()
  {
    this.gridApi.undoCellEditing();
    if(this.gridApi.getCurrentUndoSize()) 
    {
      //console.log("Ima nesto za menjanje");
      this.undoEvent.emit(true);
    }
    else this.undoEvent.emit(false)
  }

  onUndoDeleted()
  {
    /*
    this.gridApi.applyTransaction({ add: this.tempDeleted });
    
    for (let temp of this.tempDeleted) 
    {
      var index = this.rowData.indexOf(temp, 0);
      this.deletedRows.splice(this.deletedRows.indexOf(index),1);
    }

    console.log(this.tempDeleted);
    console.log(this.deletedRows);
    this.deleteEvent.emit(false);*/
  }

  //Kada se promeni u checkboxu, mora da se prikaze ili sakrije i u tabeli
  changeColomnVisibility(id: string, visible: boolean) {
    this.columnApi.setColumnVisible(id, visible);
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
  INFO
}

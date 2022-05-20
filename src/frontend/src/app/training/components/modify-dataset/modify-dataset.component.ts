import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HeaderDict, TableIndicator } from '../../models/table_models';
import { ShowTableComponent } from '../show-table/show-table.component';

@Component({
  selector: 'app-modify-dataset',
  templateUrl: './modify-dataset.component.html',
  styleUrls: ['./modify-dataset.component.css']
})
export class ModifyDatasetComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('modifyTable') public modifyTable!: ShowTableComponent;
  @Input() table_data:any;
  @Input() header:HeaderDict[] = [];
  @Input() undoDisabled:boolean = true;

  constructor(private cd: ChangeDetectorRef) 
  {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.table_data = changes['table_data'].currentValue;
    this.header = changes['header'].currentValue;
    this.refreshView();
  }

  ngOnInit(): void 
  {
  }

  refreshView()
  {
    if (this.modifyTable) this.modifyTable.prepareTable(TableIndicator.DATA_MANIPULATION, this.table_data, this.header);
  }

  ngAfterViewInit() {
    this.refreshView();

    this.cd.detectChanges();
  }
  onRemoveSelected()
  {
    this.modifyTable.onRemoveSelected();
  }
  onUndo()
  {
    this.modifyTable.onUndo();
  }

  enableUndo(indicator:boolean)
  {
    if (indicator) this.undoDisabled = false;
    else this.undoDisabled = true;
  }

  getEditedCells()
  {
    return this.modifyTable.editedCells;
  }
  getDeletedRows()
  {
    return this.modifyTable.deletedRows;
  }
  getDeletedCols()
  {
    return this.modifyTable.deletedCols;
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    return false;
  }
}

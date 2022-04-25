import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeaderDict, TableIndicator } from '../../models/table_models';
import { ShowTableComponent } from '../show-table/show-table.component';

@Component({
  selector: 'app-modify-dataset',
  templateUrl: './modify-dataset.component.html',
  styleUrls: ['./modify-dataset.component.css']
})
export class ModifyDatasetComponent implements OnInit, AfterViewInit {

  @ViewChild('modifyTable') private modifyTable!: ShowTableComponent;
  @Input() title:string;
  @Input() table_data:any;
  @Input() header:HeaderDict[];

  constructor(@Inject(MAT_DIALOG_DATA) data: { title: string, table_data: any, header:HeaderDict[] }, private cd: ChangeDetectorRef) 
  {
    this.title = data.title;
    this.table_data = data.table_data;
    this.header = data.header;
  }

  ngOnInit(): void 
  {
  }

  ngAfterViewInit() {
    this.modifyTable.prepareTable(TableIndicator.DATA_MANIPULATION, this.table_data, this.header);

    this.cd.detectChanges();
  }
}

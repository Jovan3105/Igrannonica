import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { LabelsComponent } from './components/labels/labels.component';
import { ShowTableComponent } from './components/show-table/show-table.component';
import { AgGridModule } from 'ag-grid-angular';
import { TableService } from './services/table.service';


@NgModule({
  declarations: [
    LabelsComponent,
    ShowTableComponent
  ],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    SharedModule,
    AgGridModule.withComponents([])
  ],
  exports:[
    LabelsComponent,
    ShowTableComponent
  ],
  providers:[
    TableService
  ]
})
export class TrainingModule { }

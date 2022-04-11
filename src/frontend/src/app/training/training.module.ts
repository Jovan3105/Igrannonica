import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { LabelsComponent } from './components/labels/labels.component';
import { ShowTableComponent } from './components/show-table/show-table.component';

import { AgGridModule } from 'ag-grid-angular';
import { TableService } from './services/table.service';
import { HyperparametersComponent } from './components/hyperparameters/hyperparameters.component';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    LabelsComponent,
    ShowTableComponent,
    HyperparametersComponent
  ],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    SharedModule,
    AgGridModule.withComponents([]),
    NgxNumberSpinnerModule,
    MatSelectModule,
    BrowserAnimationsModule,
    NgxSliderModule,
    NgxMatSelectSearchModule,
    NgMultiSelectDropDownModule
  ],
  exports:[
    LabelsComponent,
    ShowTableComponent,
    HyperparametersComponent
  ],
  providers:[
    TableService
  ]
})
export class TrainingModule { }

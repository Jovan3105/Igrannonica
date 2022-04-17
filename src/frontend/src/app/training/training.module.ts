import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

import { TrainingRoutingModule } from './training-routing.module';
import { LabelsComponent } from './components/labels/labels.component';
import { ShowTableComponent } from './components/show-table/show-table.component';

import { AgGridModule } from 'ag-grid-angular';
import { TableService } from './services/table.service';
import { HyperparametersComponent } from './components/hyperparameters/hyperparameters.component';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TrainingViewComponent } from './_training-view/training-view.component';
import { NgChartsModule } from 'ng2-charts';
import {NgxFilesizeModule} from 'ngx-filesize';
import { ChartComponent } from './components/chart/chart.component';
import { UploadComponent } from './components/upload/upload.component';
import { DragAndDropDirective } from './services/drag-and-drop.directive';


@NgModule({
  declarations: [
    LabelsComponent,
    ShowTableComponent,
    HyperparametersComponent,
    TrainingViewComponent,
    ChartComponent,
    UploadComponent,
    DragAndDropDirective
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
    NgMultiSelectDropDownModule,
    MatIconModule,
    NgChartsModule,
    MatTabsModule,
    NgxFilesizeModule
  ],
  exports: [
    LabelsComponent,
    ShowTableComponent,
    HyperparametersComponent,
    TrainingViewComponent
  ],
  providers: [
    TableService
  ]
})
export class TrainingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { LabelsComponent } from './components/labels/labels.component';


@NgModule({
  declarations: [
    LabelsComponent
  ],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    SharedModule
  ],
  exports:[
    LabelsComponent
  ]
})
export class TrainingModule { }

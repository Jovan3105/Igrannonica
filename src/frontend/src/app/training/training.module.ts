import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { LabelsComponent } from './components/labels/labels.component';


@NgModule({
  declarations: [
    LabelsComponent
  ],
  imports: [
    CommonModule,
    TrainingRoutingModule
  ],
  exports:[
    LabelsComponent
  ]
})
export class TrainingModule { }

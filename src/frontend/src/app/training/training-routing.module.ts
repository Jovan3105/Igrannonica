import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HyperparametersComponent } from './components/hyperparameters/hyperparameters.component';
import { UploadComponent } from './components/upload/upload.component';
import { TrainingViewComponent } from './_training-view/training-view.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, /*canActivate:[DashboardGuard] */ },
  { path: 'training', component: TrainingViewComponent },
  {path:'upload', component:UploadComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }

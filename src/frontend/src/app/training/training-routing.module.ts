import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LabelsComponent } from './components/labels/labels.component';
import { ShowTableComponent } from './components/show-table/show-table.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, /*canActivate:[DashboardGuard] */ }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardGuard } from '../core/guards/dashboard.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { TrainingViewComponent } from './_training-view/training-view.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuard] },
  { path: 'training', component: TrainingViewComponent, canActivate: [DashboardGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }

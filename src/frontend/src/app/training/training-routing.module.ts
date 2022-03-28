import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { ShowTableComponent } from './components/show-table/show-table.component';

const routes: Routes = [
  { path:'dashboard', component:ShowTableComponent, /*canActivate:[DashboardGuard] */},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }

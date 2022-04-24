import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path:'', redirectTo:'home', pathMatch: 'full' }
  // Kostur da ako bude bilo potrebe postavimo lazy-loading
  /*
  {
    path: 'datasets',
    loadChildren: () => import('./datasets/datasets.module').then(m => m.DatasetsModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'trening',
    loadChildren: () => import('./training/training.module').then(m => m.TrainingModule)
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

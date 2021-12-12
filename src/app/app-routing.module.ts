import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterGaurdGuard } from './router-gaurd.guard';
import { ResultsComponent } from './search/results/results.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'results',
    component: ResultsComponent,
    canActivate: [RouterGaurdGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

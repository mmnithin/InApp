import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardViewComponent } from './board-view/board-view.component';


const routes: Routes = [
  {
    path: '',
    component: BoardViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardManagementRoutingModule { }

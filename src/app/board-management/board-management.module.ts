import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardManagementRoutingModule } from './board-management-routing.module';
import { BoardViewComponent } from './board-view/board-view.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [BoardViewComponent],
  imports: [
    CommonModule,
    BoardManagementRoutingModule,
    ReactiveFormsModule,
  ]
})
export class BoardManagementModule { }

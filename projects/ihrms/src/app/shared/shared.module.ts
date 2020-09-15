import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AgridComponent } from './agrid/agrid.component';
import { ActionComponent } from './agrid/components/action/action.component';
import { AgGridModule } from "ag-grid-angular";

import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AgridComponent,
    ActionComponent
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      ActionComponent
    ]),
    SharedRoutingModule,
    MatInputModule
  ],
  exports: [
    ActionComponent,
    AgridComponent
  ]
})
export class SharedModule { }

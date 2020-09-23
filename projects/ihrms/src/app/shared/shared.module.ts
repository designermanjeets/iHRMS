import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AgridComponent } from './agrid/agrid.component';
import { ActionComponent } from './agrid/components/action/action.component';
import { AgGridModule } from "ag-grid-angular";
import { NgxUploaderModule } from 'ngx-uploader';

import { MatInputModule } from '@angular/material/input';
import { DatetimeComponent } from './agrid/components/datetime/datetime.component';
import { AnchorComponent } from './agrid/components/anchor/anchor.component';
import { StatusComponent } from './agrid/components/status/status.component';

@NgModule({
  declarations: [
    AgridComponent,
    ActionComponent,
    DatetimeComponent,
    AnchorComponent,
    StatusComponent
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      ActionComponent,
      DatetimeComponent,
      AnchorComponent,
      StatusComponent
    ]),
    SharedRoutingModule,
    MatInputModule,
    NgxUploaderModule
  ],
  exports: [
    ActionComponent,
    AgridComponent
  ]
})
export class SharedModule { }

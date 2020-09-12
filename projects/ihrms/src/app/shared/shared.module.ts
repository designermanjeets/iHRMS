import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { AgridComponent } from './agrid/agrid.component';
import { ActionComponent } from './agrid/components/action/action.component';


@NgModule({
  declarations: [
    AgridComponent, 
    ActionComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    ActionComponent
  ]
})
export class SharedModule { }

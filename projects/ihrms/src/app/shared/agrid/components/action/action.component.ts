import { Component, Output, EventEmitter } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements ICellRendererAngularComp {

  public params: any;
  @Output() onActionClick = new EventEmitter<any>();

  constructor() { }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onEdit($event) {
    const params = {
      event: $event,
      rowData: this.params.node,
      type: 'edit'
    }
    this.params.clicked(params);
  }

  onDelete($event) {
    const params = {
      event: $event,
      rowData: this.params.node,
      type: 'delete'
    }
    this.params.clicked(params);
  }

}

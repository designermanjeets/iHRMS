import {Component, EventEmitter, Output} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
  selector: 'app-anchor',
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss']
})
export class AnchorComponent implements ICellRendererAngularComp {

  public params: any;
  @Output() onAnchorClick = new EventEmitter<any>();

  constructor() { }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick($event) {
    const params = {
      event: $event,
      rowData: this.params.node,
      type: 'click'
    }
    this.params.clicked(params);
  }

}

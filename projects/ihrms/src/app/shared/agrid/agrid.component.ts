import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColumnApi, GridApi, GridOptions} from "ag-grid-community";

@Component({
  selector: 'app-agrid',
  templateUrl: './agrid.component.html',
  styleUrls: ['./agrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AgridComponent implements OnInit {

  @Input() rowData;
  @Input() columnDefs;
  @Input() rowHeight;
  @Input() gridOptions;

  @Output() onGridApiCreated = new EventEmitter();
  @Output() emitRowSelected = new EventEmitter();
  @Output() onLoadData = new EventEmitter();


  private gridApi: GridApi;
  private gridColumnApi: ColumnApi

  constructor() { }

  ngOnInit(): void {
  }

  onGridReady(params: GridOptions) {
    this.gridOptions = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  onRowSelected($event) {
    this.emitRowSelected.emit($event);
    $event = {};
  }

  sizeToFit() {
    this.onGridApiCreated.emit({
      gridOptions: this.gridOptions,
      gridApi: this.gridApi,
      gridColumnApi: this.gridColumnApi
    })

    this.gridApi.sizeColumnsToFit();

    window.addEventListener('resize', function (){
      setTimeout(function(){
        this.gridApi && this.gridApi.sizeColumnsToFit();
      },1);
    });
  }

}

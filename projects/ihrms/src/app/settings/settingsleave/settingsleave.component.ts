import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'
import {ActionComponent} from "../../shared/agrid/components/action/action.component";
import {GridOptions} from "ag-grid-community";

declare const $:any;

@Component({
  selector: 'app-settingsleave',
  templateUrl: './settingsleave.component.html',
  styleUrls: ['./settingsleave.component.css']
})
export class SettingsleaveComponent implements OnInit {

  public rows = [];
  public srch = [];

  public addLT:any = {};
  public uptLT:any = {};


  columnDefs = [
    {headerName: 'Leave Type', field: 'leave_type' },
    {headerName: 'Leave Days', field: 'leave_days'},
    {headerName: 'Carry Forward', field: 'carryforward'},
    {headerName: 'Active', field: 'status'},
    {headerName: 'Action', field: 'action', cellRendererFramework: ActionComponent, cellRendererParams: {
        clicked: (params) => this.actionClick(params)
      }},
  ];
  rowData;
  private gridApi;
  private gridColumnApi;
  private gridOptions: GridOptions;

  constructor(private leaveService:AppService) {
    this.rows = leaveService.leaveType;
    this.srch = [...this.rows];
    this.rowData = leaveService.leaveType;
  }

  ngOnInit() {
    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');
  }


  actionClick(params) {
    if(params.type === 'edit') {
      this.onEdit(params.rowData.data);
    }
    if(params.type === 'delete') {
      // this.actionParams = params.rowData.data.email;
      $('#delete_employee').modal('show');
    }
  }

  onGridReady($event) {
    console.log($event);
  }

  addReset(){
    let randomnumber = Math.floor(Math.random() * 500);
    this.addLT = {'id':randomnumber};
    $('#add_leavetype').modal('show');
  }

  addLeavetype(f)
  {
    //console.log(f.form.value);
    f.form.value.status = 'Active';
    this.rows.unshift(f.form.value);
    this.srch.unshift(f.form.value);
    this.rows = this.rows;
    $('#add_leavetype').modal('hide');

  }

  onEdit(item){
    this.uptLT = item;
    $('#edit_leavetype').modal('show');
  }

  updateLeavetype(f)
  {
    //console.log(f.form.value);
    var id = f.form.value.id;
    //console.log(id);
    var arr = this.rows.find(function(item, i){
      return item.id === id
    });

    arr.id = f.form.value.id;
    arr.leave_type = f.form.value.leave_type;
    arr.leave_days = f.form.value.leave_days;

    var index = this.rows.findIndex(function(item, i){
      return item.id === id
    });

    //console.log(index);
    if (index > -1) {
        this.rows.splice(index, 1);
    }

    this.rows.unshift(arr);
    this.srch.unshift(arr);
    this.rows = this.rows;
    $('#edit_leavetype').modal('hide');

  }

  onDelete(c){
    //console.log("="+c.id+"=");
    var index = this.rows.findIndex(function(item, i){
      return item.id === c.id
    });

    //console.log(index);
    if (index > -1) {
        this.rows.splice(index, 1);
        this.srch.splice(index, 1);
    }
    //console.log(this.rows);
    this.rows = this.rows;
  }


}

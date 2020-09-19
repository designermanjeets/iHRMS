import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'
import {ActionComponent} from "../../shared/agrid/components/action/action.component";
import {GridOptions} from "ag-grid-community";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Apollo } from "apollo-angular";
import {
  DeleteLeaveTypeGQL,
  GET_LEAVETYPES_QUERY,
  RegisterLeaveTypeGQL,
  UpdateLeaveTypeGQL
} from "./leave-types-gql.service";
import {StatusComponent} from "../../shared/agrid/components/status/status.component";

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

  uptForm: FormGroup;
  addForm: FormGroup;
  actionParams: any;

  columnDefs = [
    {headerName: 'Leave Type', field: 'leavetype' },
    {headerName: 'Leave Days', field: 'leavedays'},
    {headerName: 'Carry Forward', field: 'carryforward'},
    {headerName: 'Active', field: 'status', cellRendererFramework: StatusComponent,},
    {headerName: 'Action', field: 'action', cellRendererFramework: ActionComponent, cellRendererParams: {
        clicked: (params) => this.actionClick(params)
      }},
  ];
  rowData;
  private gridApi;
  private gridColumnApi;
  private gridOptions: GridOptions;

  constructor(
    private leaveService: AppService,
    private fb: FormBuilder,
    private apollo: Apollo,
    private registerLeaveTypeGQL: RegisterLeaveTypeGQL,
    private updateLeaveTypeGQL: UpdateLeaveTypeGQL,
    private deleteLeaveTypeGQL: DeleteLeaveTypeGQL,
  ) {
    this.rows = leaveService.leaveType;
    this.srch = [...this.rows];
    this.rowData = leaveService.leaveType;
  }

  ngOnInit() {
    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

    this.getLeaveTypes();

    this.uptForm = this.fb.group({
      leavetype: ['', Validators.required],
      leavedays: ['', Validators.required],
      carryforward: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      leavetype: ['', Validators.required],
      leavedays: ['', Validators.required],
      carryforward: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  getLeaveTypes() {
    this.apollo.watchQuery({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if(response.data.getLeaveTypes) {
        this.rowData = response.data.getLeaveTypes;
      }
    });
  }

  actionClick(params) {
    if(params.type === 'edit') {
      this.onEdit(params.rowData.data);
    }
    if(params.type === 'delete') {
      this.actionParams = params.rowData.data._id;
      $('#delete_leavetype').modal('show');
    }
  }

  onDeleteSub(res) {
    if(res === 'yes') {
      this.onDelete(this.actionParams);
      $('#delete_leavetype').modal('hide');
      this.actionParams = null;
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

  addLeavetype(f) {
    this.registerLeaveTypeGQL
      .mutate({
        "leavetype": f.value.leavetype,
        "leavedays": f.value.leavedays,
        "carryforward": f.value.carryforward,
        "status": f.value.status,
      })
      .subscribe( (val: any) => {
        if(val.data.createLeaveType) {
          console.log(val.data.createLeaveType);
          this.getLeaveTypes(); // fetch latest
          $('#add_leavetype').modal('hide');
        }
      }, error => console.log(error));
  }

  onEdit(item){
    this.uptLT = item;
    this.uptForm.patchValue(item);
    $('#edit_leavetype').modal('show');
  }

  updateLeavetype(f) {
    this.updateLeaveTypeGQL
      .mutate({
        "id": this.uptLT._id,
        "leavetype": f.value.leavetype,
        "leavedays": f.value.leavedays,
        "carryforward": f.value.carryforward,
        "status": f.value.status,
      })
      .subscribe( (val: any) => {
        if(val.data.updateLeaveType) {
          console.log(val.data.updateLeaveType);
          this.getLeaveTypes(); // fetch latest
          $('#edit_leavetype').modal('hide');
        }
      }, error => console.log(error));
  }

  onDelete(id){
    this.deleteLeaveTypeGQL
      .mutate({
        "id": id
      })
      .subscribe( (val: any) => {
        if(val.data.deleteLeaveType) {
          this.getLeaveTypes();
        }
      }, error => console.log(error));
  }


}

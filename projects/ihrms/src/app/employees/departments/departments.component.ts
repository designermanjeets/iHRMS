import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from '../../app.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Apollo, Query} from "apollo-angular";
import {
  CreateDepartmentGQL,
  DeleteDepartmentGQL,
  GET_DEPARTMENTS_QUERY,
  SetGetDepartmentsService
} from "./department-gql.service";
import {GET_DESIGNATIONS_QUERY, UpdateDesignationGQL} from "../designations/designation-gql.service";
import {map} from "rxjs/operators";
import * as _ from "lodash";
import {GET_LEAVETYPES_QUERY} from "../../settings/settingsleave/leave-types-gql.service";

declare const $:any;

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  public rows = [];

  editForm: FormGroup;
  actionParams: any;

 allDesignations: any;
 modalDesigns: any;
 allLeaveTypes: any;
 checkedLeaveTypes: any = [];
 desigTemp = [];
  checkwithleavetype: any;

  public srch = [];
  public addD:any = {};
  addDepartmentValidation:boolean = false;

  desigOptions: string[] = [];

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private apollo: Apollo,
    private createDepartmentGQL: CreateDepartmentGQL,
    private deleteDesignationGQL: DeleteDepartmentGQL,
    private setGetDepartmentsService: SetGetDepartmentsService,
    private updateDesignationGQL: UpdateDesignationGQL,
  ) { }

  ngOnInit() {
    this.editForm = this.fb.group({
      department: ['', Validators.required]
    });

    this.getDepartments();
  }

  addReset(){
    this.editForm.reset();
    $('#add_department').modal('show');
  }

  actionClickDelete(item) {
    this.actionParams = item;
    $('#delete_department').modal('show');
  }

  onDeleteSub() {
    this.onDelete(this.actionParams._id);
    $('#delete_department').modal('hide');
    this.actionParams = null;
  }

  addDepartment(f){

    this.createDepartmentGQL
      .mutate({
        "department": f.value.department,
        "created_at": Date.now(),
      })
      .subscribe( (val: any) => {
        if(val.data) {
          this.getDepartments(); // fetch latest
          $('#add_department').modal('hide');
        }
      }, error => console.log(error));
  }

  getDepartments() {
    this.apollo.watchQuery({
      query: GET_DEPARTMENTS_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if(response.data) {
        console.log(response.data);
        this.rows = response.data.getDepartments;
        this.srch = [...this.rows];
        this.setGetDepartmentsService.setDepartments(response.data.getDepartments);
        this.getDesignations();
      }
    });
  }

  getDesignations() {
    this.apollo.watchQuery<Query>({
      query: GET_DESIGNATIONS_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges
      .pipe(
        map((result: any) => result.data.getDesignations)
      ).subscribe(data => {
        this.allDesignations = data;
        console.log(data);
    });
  }

  getAllLeaveTypes() {
    this.apollo.watchQuery({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if(response.data.getLeaveTypes) {
        console.log(response.data);
        this.allLeaveTypes = response.data.getLeaveTypes;
      }
    });
  }

  getDesignById(id) {
    return _.filter(this.allDesignations, p => p.department_ID === id);
  }

  leaveAssign(item) {
    this.checkedLeaveTypes = []; // Empty everytime before Load
    $('#leave_allocation').modal('show');
    this.modalDesigns = this.getDesignById(item._id);
    console.log(this.modalDesigns);
    this.getAllLeaveTypes();
  }

  onDesigSelectionChange(event, item, i){
    // console.log(event.option)
    // console.log(item)
    const obj = {
      'index': i,
      'department': item.department,
      'designationID': item._id,
      'designation': item.designation,
      'departmentID': item.department_ID,
      'leave_ID': event.option && event.option._value._id,
      'leavedays': event.option && event.option._value.leavedays,
      'leavetype': event.option && event.option._value.leavetype
    }
    if(event.option && event.option._selected) {
      this.checkedLeaveTypes.push(obj);
    } else {
      _.remove(this.checkedLeaveTypes, {leave_ID: obj.leave_ID, index: i});
    }
    console.log(this.checkedLeaveTypes)

  }

  setAll(checked, list, item, i) {
    if(checked) {
      this.selectAll(list, item, i);
    } else {
      this.deselectAll(list, item, i);
    }
  }

  selectAll(list, item, i) {
    list.selectAll();
    _.remove(this.checkedLeaveTypes, {index: i});
    const _this = this;
    _.forEach(list._value, function(val){
      const obj = {
        'index': i,
        'department': item.department,
        'designationID': item._id,
        'designation': item.designation,
        'departmentID': item.department_ID,
        'leave_ID': val._id,
        'leavedays': val.leavedays,
        'leavetype': val.leavetype
      }
      _this.checkedLeaveTypes.push(obj);
    });
  }

  deselectAll(list, item, i) {
    list.deselectAll();
    _.remove(this.checkedLeaveTypes, {index: i});
  }

  updateDesignation(desig){
    console.log(desig);
    this.updateDesignationGQL
      .mutate({
        "id": desig.designationID,
        "designation": desig.designation,
        "department": desig.department,
        "department_ID": desig.departmentID,
        "modified": {
          "modified_at": Date.now(),
          "modified_by": JSON.parse(sessionStorage.getItem('user')).username
        },
        "leavetype": {
          "leavetype":desig.leavetype,
          "leavedays": desig.leavedays,
          "leave_ID": desig.leaveTypeID
        }
      })
      .subscribe( (val: any) => {
        if(val.data) {
          console.log(val.data);
          $('#leave_allocation').modal('hide');
        }
      }, error => console.log(error));
  }

  applyLeaveTypes() {
    this.checkedLeaveTypes.forEach(val =>{
      this.updateDesignation(val);
    })
  }

  onEdit(item){
    this.router.navigate(['employees/departments/edit'], { queryParams: { 'id': item._id } });
  }

  onDelete(id){
    this.deleteDesignationGQL
      .mutate({
        "id": id,
        "modified": {
          "modified_by": JSON.parse(sessionStorage.getItem('user')).username,
          "modified_at": Date.now()
        }
      })
      .subscribe( (val: any) => {
        if(val.data) {
          this.getDepartments();
        }
      }, error => console.log(error));
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {
  CreateDesignationGQL,
  DeleteDesignationGQL,
  GET_DESIGNATIONS_QUERY,
  SetGetDesignationsService
} from "./designation-gql.service";
import {Apollo} from "apollo-angular";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GET_DEPARTMENTS_QUERY} from "../departments/department-gql.service";
import {GET_LEAVETYPES_QUERY} from "../../settings/settingsleave/leave-types-gql.service";
import * as _ from 'lodash';

declare const $:any;

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationsComponent implements OnInit {

  rows = [];

  editForm: FormGroup;
  actionParams: any;
  departments: any;
  allLeaveTypes: any;

  public srch = [...this.rows];
  public addD:any = {};
  addDesignationValidation:boolean = false;
  formLoad = false;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private apollo: Apollo,
    private createDesignationGQL: CreateDesignationGQL,
    private deleteDesignationGQL: DeleteDesignationGQL,
    private setGetDesignationsService: SetGetDesignationsService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    // this.rows = appService.designations; // No Mock
    // this.srch = [...this.rows];

  }

  ngOnInit() {
    this.getDesignations();
  }

  initForm() {
    this.editForm = this.fb.group({
      designation: ['', Validators.required],
      department: ['', Validators.required],
      leavetype: this.fb.array([]) ,
    });
  }

  leavetype() : FormArray {
    return this.editForm && this.editForm.get("leavetype") as FormArray
  }

  newLeaveTtypes(val): FormGroup {
    return this.editForm && this.fb.group({
      leavetype: val.leavetype,
      leave_ID: val._id,
      leavedays: val.leavedays,
      leavechecked: val.leavechecked
    })
  }

  addLeaveTtypes(val) {
    if(this.editForm) {
      this.leavetype().push(this.newLeaveTtypes(val));
    }
  }

  removeLeaveTtypes(i:number) {
    if(this.editForm) {
      this.leavetype().removeAt(i);
    }
  }


  getAllLeaveTypes() {
    this.apollo.query({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).subscribe((response: any) => {
      if(response.data.getLeaveTypes) {
        this.allLeaveTypes = response.data.getLeaveTypes;
        _.forEach(this.allLeaveTypes, val => delete val['leavechecked']); // Cache Issue
        _.forEach(this.allLeaveTypes, val => this.addLeaveTtypes(val));
      }
      this.cdRef.detectChanges();
    });
  }

  getDesignations() {
    this.apollo.watchQuery({
      query: GET_DESIGNATIONS_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if(response.data) {
        this.rows = response.data.getDesignations;
        this.srch = [...this.rows];
        this.setGetDesignationsService.setDesignations(response.data.getDesignations);
        this.getDepartments();
        this.getAllLeaveTypes();
        this.cdRef.detectChanges();
      }
    });
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
        this.departments = response.data.getDepartments;
        this.setGetDesignationsService.setDepartments(this.departments);
      }
    });
  }

  addReset(){
    this.initForm();
    this.getAllLeaveTypes();
    this.editForm.reset();
    $('#add_designation').modal('show');
  }

  actionClickDelete(item) {
    this.actionParams = item;
    $('#delete_designation').modal('show');
  }

  onDeleteSub() {
    this.onDelete(this.actionParams._id);
    $('#delete_designation').modal('hide');
    this.actionParams = null;
  }

  addDesignation(f){

    const newFormObj = JSON.parse(JSON.stringify(f.value));
    newFormObj.leavetype = _.filter(newFormObj.leavetype, {leavechecked: true});
    newFormObj.leavetype = _.forEach(newFormObj.leavetype, (d) => {
      delete d['leavechecked']
    });

    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    this.createDesignationGQL
      .mutate({
        "designation": f.value.designation,
        "department": dprt.department,
        "department_ID": dprt._id,
        "created_at": Date.now(),
        "leavetype": newFormObj.leavetype
      })
      .subscribe( (val: any) => {
        if(val.data) {
          this.getDesignations(); // fetch latest
          $('#add_designation').modal('hide');
        }
      }, error => console.log(error));
  }

  onEdit(item){
    this.router.navigate(['employees/designations/edit'], { queryParams: { 'id': item._id } });
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
          this.getDesignations();
        }
      }, error => console.log(error));
  }

}

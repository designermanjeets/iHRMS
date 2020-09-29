import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {SetGetDesignationsService, UpdateDesignationGQL} from "../designations/designation-gql.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GET_LEAVETYPES_QUERY} from "../../settings/settingsleave/leave-types-gql.service";
import {Apollo} from "apollo-angular";
import * as _ from "lodash";

@Component({
  selector: 'app-designation-details',
  templateUrl: './designation-details.component.html',
  styleUrls: ['./designation-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationDetailsComponent implements OnInit {

  rows = [];
  editForm: FormGroup;
  departments: any;
  allLeaveTypes: any;

  public srch = [];
  public uptD:any = [];
  uptDesignationValidation:boolean = false;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private setGetDesignationsService: SetGetDesignationsService,
    private updateDesignationGQL: UpdateDesignationGQL,
    private fb: FormBuilder,
    private apollo: Apollo,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.getAllLeaveTypes();

    this.editForm = this.fb.group({
      designation: ['', Validators.required],
      department: ['', Validators.required],
      leavetype: this.fb.array([]) ,
    });

    this.route.queryParams.subscribe(params => {
      this.uptD = [];
      if(params.id) {
        const desig = this.setGetDesignationsService.getDesignations(params.id);
        if(!desig) {
          this.router.navigate(['employees/designations']);
        } else {
          this.uptD = desig;
          this.departments = this.setGetDesignationsService.getAllDepartments();
          this.editForm.patchValue(this.uptD);
          this.editForm.get('department').patchValue(this.uptD.department_ID);
          _.forEach(this.uptD.leavetype, val => val['leavechecked'] = true)
        }
      } else {
        this.router.navigate(['employees/designations']);
      }
    });
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

        _.forEach(this.uptD.leavetype, up =>{
          _.forEach(this.allLeaveTypes, val => {
            if(up.leavechecked) {
              if(val._id === up.leave_ID) {
                val['leavechecked'] = true
              }
            }
          })
        })

        _.forEach(this.allLeaveTypes, val => this.addLeaveTtypes(val));
        this.cdRef.detectChanges();
      }
    });
  }

  leavetype() : FormArray {
    return this.editForm.get("leavetype") as FormArray
  }

  newLeaveTtypes(val): FormGroup {
    return this.fb.group({
      leavetype: val.leavetype,
      leave_ID: val._id,
      leavedays: val.leavedays,
      leavechecked: val.leavechecked
    })
  }

  addLeaveTtypes(val) {
    this.leavetype().push(this.newLeaveTtypes(val));
  }

  removeLeaveTtypes(i:number) {
    this.leavetype().removeAt(i);
  }

  cancelEdit() {
    this.router.navigate(['employees/designations']);
  }

  updateDesignation(f){
    const newFormObj = JSON.parse(JSON.stringify(f.value));
    newFormObj.leavetype = _.filter(newFormObj.leavetype, {leavechecked: true});
    newFormObj.leavetype = _.forEach(newFormObj.leavetype, (d) => {
      delete d['leavechecked']
    });

    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    this.updateDesignationGQL
      .mutate({
        "id": this.uptD._id,
        "designation": newFormObj.designation,
        "department": dprt.department,
        "department_ID": dprt._id,
        "modified": {
          "modified_at": Date.now(),
          "modified_by": JSON.parse(sessionStorage.getItem('user')).username
        },
        "leavetype": newFormObj.leavetype
      })
      .subscribe( (val: any) => {
        if(val.data) {
          this.router.navigate(['employees/designations']);
          this.cdRef.detectChanges();
        }
      }, error => console.log(error));
  }
}

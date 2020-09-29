import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { Router,ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import {EmployeeGQLService} from "../all-employees/employee-gql.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpdetailGQLService} from "./empdetail-gql.service";
import {GET_COMPANIES_QUERY} from "../../settings/settingscompany/companysettingGQL";
import {Apollo} from "apollo-angular";
import {GET_DEPARTMENTS_QUERY} from "../departments/department-gql.service";
import {GET_DESIGNATIONS_QUERY, SetGetDesignationsService} from "../designations/designation-gql.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '38px'
  };

  rows = [];
  public uptEmp:any = [];
  public srch = [];

  uptEmployeeValidation:boolean = false;
  editForm: FormGroup;
  companies: [];
  departments: any;
  designations: any;
  allDesignations: any;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private employeeGQLService: EmployeeGQLService,
    private empdetailGQLService: EmpdetailGQLService,
    private apollo: Apollo,
    private setGetDesignationsService: SetGetDesignationsService
  ) { }

  ngOnInit() {

    this.getCompanies();
    this.getDepartments();

    this.editForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      emmpid: ['', Validators.required],
      joiningdate: ['', Validators.required],
      corporateid: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      mobile: [''],
      permissions: this.fb.group({
        holiday: this.fb.group({
          read: [''],
          write: [''],
          create: [''],
          delete: [''],
          import: [''],
          export: ['']
        }),
        leave: this.fb.group({
          read: [''],
          write: [''],
          create: [''],
          delete: [''],
          import: [''],
          export: ['']
        }),
        assets: this.fb.group({
          read: [''],
          write: [''],
          create: [''],
          delete: [''],
          import: [''],
          export: ['']
        }),
      }),
    }, { validator: this.checkPasswords });

    this.route.queryParams.subscribe(params => {
      this.uptEmp =  { };
      if(params.id) {
        const user = this.employeeGQLService.getUser(params.id);
        if(!user) {
          this.router.navigate(['employees/all-employees']);
        } else {
          this.uptEmp = user;
          this.editForm.patchValue(this.uptEmp);
          this.editForm.get('password2').patchValue(this.uptEmp.password);
          this.editForm.get('department').patchValue(this.uptEmp.department_ID);
          this.editForm.get('designation').patchValue(this.uptEmp.designation._id);
          }
        } else {
        this.router.navigate(['employees/all-employees']);
      }
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.password2.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  getCompanies() {
    this.apollo.watchQuery({
      query: GET_COMPANIES_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      this.companies = response.data.getCompanies;
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
        this.getDesignations();
      }
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
        this.allDesignations = response.data.getDesignations;
        this.setGetDesignationsService.setDesignations(this.allDesignations);
        this.editForm.get('designation').disable(); // Will enable on Department basis/selection
        this.onDepartChange({value: this.uptEmp.department_ID});
      }
    });
  }

  onDepartChange(event) {
    this.designations = _.filter(this.allDesignations, person => person.department_ID === event.value);
    if(this.designations) {
      const getDesig = _.filter(this.designations, person => person.designation === this.uptEmp.designation);
      this.editForm.get('designation').enable();
      if(getDesig[0]) {
        this.editForm.get('designation').patchValue(getDesig[0]._id);
      }
    }
  }

  cancelEdit() {
    this.router.navigate(['employees/all-employees']);
  }

  updateSubmit(f){
    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    const desig = this.setGetDesignationsService.getDesignations(f.value.designation);
    this.empdetailGQLService
      .mutate({
        "id": this.uptEmp._id,
        "username": f.value.username,
        "email": f.value.email,
        "password": f.value.password,
        "role": f.value.role,
        "department": dprt.department,
        "department_ID": dprt._id,
        "designation": {
          "designation": desig.designation
        },
        "designation_ID": desig._id,
        "emmpid": f.value.emmpid,
        "corporateid": f.value.corporateid,
        "firstname": f.value.firstname,
        "lastname": f.value.lastname,
        "joiningdate": f.value.joiningdate,
        "mobile": f.value.mobile,
        "permissions": {
          "holiday": {
            "read": f.value.permissions.holiday.read,
            "write": f.value.permissions.holiday.write
          }
        },
        "modified": {
            "modified_by": JSON.parse(sessionStorage.getItem('user')).username,
            "modified_at": Date.now()
          }
      })
      .subscribe( (val: any) => {
        if(val.data.updateUser) {
          // window.location.reload();
          this.router.navigate(['employees/all-employees']);
        }
      }, error => console.log(error));
  }
}

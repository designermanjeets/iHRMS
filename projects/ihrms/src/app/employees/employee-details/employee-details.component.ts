import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { Router,ActivatedRoute } from '@angular/router';
import { AppService } from './../../app.service';
import {EmployeeGQLService} from "../all-employees/employee-gql.service";
import {FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {EmpdetailGQLService} from "./empdetail-gql.service";
import {GET_COMPANIES_QUERY} from "../../settings/settingscompany/companysettingGQL";
import {Apollo} from "apollo-angular";
import {ErrorStateMatcher} from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

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

  // public model: any = { date: { year: 2018, month: 10, day: 9 } };
  // public model1: any = { date: { year: 2018, month: 10, day: 9 } };

  rows = [];
  public uptEmp:any = [];
  public srch = [];

  user = {
    leaveReq_read:true,
    holiday_read:false,
    clients_read:true,
    projects_read:true,
    tasks_read:true,
    chats_read:true,
    assets_read:true,
    timesheet_read:false,
    leaveReq_write:true,
    holiday_write:true,
    clients_write:true,
    projects_write:true,
    tasks_write:true,
    chats_write:true,
    assets_write:true,
    timesheet_write:true,
    leaveReq_create:true,
    holiday_create:true,
    clients_create:true,
    projects_create:true,
    tasks_create:true,
    chats_create:false,
    assets_create:true,
    timesheet_create:true,
    leaveReq_delete:true,
    holiday_delete:true,
    clients_delete:true,
    projects_delete:true,
    tasks_delete:true,
    chats_delete:true,
    assets_delete:true,
    timesheet_delete:true,
    leaveReq_import:true,
    holiday_import:true,
    clients_import:true,
    projects_import:true,
    tasks_import:true,
    chats_import:true,
    assets_import:true,
    timesheet_import:true,
    leaveReq_export:true,
    holiday_export:true,
    clients_export:true,
    projects_export:true,
    tasks_export:true,
    chats_export:true,
    assets_export:true,
    timesheet_export:true,
  };

  uptEmployeeValidation:boolean = false;
  editForm: FormGroup;
  companies: [];
  matcher = new MyErrorStateMatcher();


  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private employeeGQLService: EmployeeGQLService,
    private empdetailGQLService: EmpdetailGQLService,
    private apollo: Apollo
  ) {
    this.rows = appService.employees;
    this.srch = [...this.rows];
  }

  ngOnInit() {

    this.getCompanies();

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

  updateSubmit(f){
    console.log(f.value);
    this.empdetailGQLService
      .mutate({
        "id": this.uptEmp._id,
        "username": f.value.username,
        "email": f.value.email,
        "password": f.value.password,
        "role": f.value.role,
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

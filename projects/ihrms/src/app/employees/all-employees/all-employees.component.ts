import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import {ActivatedRoute, Router} from '@angular/router';
import { AppService } from '../../app.service';
import {ActionComponent} from '../../shared/agrid/components/action/action.component';
import {GET_COMPANIES_QUERY} from "../../settings/settingscompany/companysettingGQL";
import {EmployeeGQLService, GET_USERS_QUERY} from "./employee-gql.service";
import {Apollo} from "apollo-angular";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {CreateUserGQL, DeleteUserGQL} from "../employee-details/empdetail-gql.service";
import { ErrorStateMatcher } from '@angular/material/core';
import {GridOptions} from "ag-grid-community";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

declare const $: any;

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css']
})
export class AllEmployeesComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '38px'
  };

  public updateEmp = [];
  public createEmp:any = {};
  public srch = [];
  addEmployeeValidation:boolean = false;
  public allEmployees:boolean = true;
  public modules = [];
  public addEmp:any = {};
  filtertextbox: any;

  uptEmployeeValidation:boolean = false;
  editForm: FormGroup;
  companies: [];
  isModal: boolean;
  matcher = new MyErrorStateMatcher();
  actionParams: any;

  public date: Date = new Date();
  public model: any = {date: {year: this.date.getFullYear(), month: this.date.getMonth() + 1, day: this.date.getDate()}};

  columnDefs = [
        {headerName: 'Name', field: 'firstname',
          getQuickFilterText: (params) => params.value,
        },
        {headerName: 'Employee ID', field: 'emmpid' },
        {headerName: 'Email', field: 'email'},
        {headerName: 'Mobile', field: 'mobile'},
        {headerName: 'Join Date', field: 'joiningdate'},
        {headerName: 'Role', field: 'role'},
        {headerName: 'Action', field: 'action', cellRendererFramework: ActionComponent, cellRendererParams: {
          clicked: (params) => this.actionClick(params)
        }},
    ];
  rowData;
  private gridApi;
  private gridColumnApi;
  private gridOptions: GridOptions;

  constructor(
    private appService:AppService,
    private router:Router,
    private apollo: Apollo,
    private employeeGQLService: EmployeeGQLService,
    private fb: FormBuilder,
    private createUserGQL: CreateUserGQL,
    private cdref: ChangeDetectorRef,
    private deleteUserGQL: DeleteUserGQL,
    private activeRoute: ActivatedRoute,
    private getuserquery: GET_USERS_QUERY
  ) {
    this.srch = [];
    this.modules = appService.employee_modules;

    this.getUsers();
    this.getCompanies();

  }

  ngOnInit() {

    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

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
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
        leave: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
        assets: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
      }),
    }, { validator: this.checkPasswords });
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
      console.log(this.companies);
    });
  }

  actionClick(params) {
    if(params.type === 'edit') {
      this.onEdit(params.rowData.data);
    }
    if(params.type === 'delete') {
        this.actionParams = params.rowData.data.email;
        $('#delete_employee').modal('show');
    }
  }

  onYes(res) {
    if(res === 'yes'){
      this.onDelete(this.actionParams);
      $('#delete_employee').modal('hide');
      this.actionParams = null;
    }
}

  getUsers() {
    this.getuserquery.watch({
      "pagination": {
        "limit": 100
      }
    }, {
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe((response: any) => {
      console.log(response)
      this.rowData = response.data.users;
      this.employeeGQLService.setUsers(response.data.users);
    });
  }

  public empUpt = {};
  public vals = [];

  addReset(){
    let randomnumber = Math.floor(Math.random() * 99);
    $('#add_employee').modal('show');
    this.cdref.detectChanges();
  }

  createSubmit(f){
    this.createUserGQL
      .mutate({
        "firstname": f.value.firstname,
        "lastname": f.value.lastname,
        "username": f.value.username,
        "email": f.value.email,
        "password": f.value.password,
        "role": f.value.role,
        "emmpid": f.value.emmpid,
        "corporateid": f.value.corporateid,
        "joiningdate": f.value.joiningdate,
        "mobile":f.value.mobile,
        "permissions": {
          "holiday": {
            "read": f.value.permissions.holiday.read,
            "write": f.value.permissions.holiday.write
          }
        }
      })
      .subscribe( (val: any) => {
        if(val.data.signup.username) {
          $('#add_employee').modal('hide');
          this.getUsers();
        }
      }, error => console.log(error));
  }

  onEdit(item){
    this.router.navigate(['employees/all-employees/edit'], { queryParams: { 'id': item.emmpid } });
  }

  onDelete(email){
    this.deleteUserGQL
    .mutate({
      "email": email
    })
    .subscribe( (val: any) => {
      if(!val.data.deleteUser.email) {
        this.getUsers();
      }
    }, error => console.log(error));
  }

  searchID(val) {
    //console.log(val);
    val = val.toString();
    //console.log(this.srch);
    // this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.employeeID);
      d.employeeID = d.employeeID.toString();
      return d.employeeID.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    // this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchName(val) {
    //console.log(val);
    //console.log(this.srch);
    // this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.userName);
      val = val.toLowerCase();
      return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    // this.rows.push(...temp);
    //console.log(this.rows);
  }

  searchDesg(val) {
    //console.log(val);
    //console.log(this.srch);
    // this.rows.splice(0, this.rows.length);
    //console.log(this.rows);
    let temp = this.srch.filter(function(d) {
      //console.log(d.designation);
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    //console.log(temp);
    // this.rows.push(...temp);
    //console.log(this.rows);
  }

  onGridReady(params: any) {
    console.log(params);
    this.gridOptions = params.gridOptions;
    this.gridApi = params.gridApi;
    this.gridColumnApi = params.gridColumnApi;
  }

  onFilterTextBoxChanged(filtertextbox) {
    this.gridOptions.api.setQuickFilter(filtertextbox);
  }

}

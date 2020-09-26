import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import {ActivatedRoute, Router} from '@angular/router';
import { AppService } from '../../app.service';
import {ActionComponent} from '../../shared/agrid/components/action/action.component';
import {GET_COMPANIES_QUERY, } from "../../settings/settingscompany/companysettingGQL";
import {EmployeeGQLService, GET_USERS_QUERY} from "./employee-gql.service";
import {Apollo} from "apollo-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CreateUserGQL, DeleteUserGQL, ImportUsersGQL} from "../employee-details/empdetail-gql.service";
import {GridOptions} from "ag-grid-community";
import {DatetimeComponent} from "../../shared/agrid/components/datetime/datetime.component";
import * as moment from 'moment';
import * as _ from 'lodash';
import {GET_DEPARTMENTS_QUERY} from "../departments/department-gql.service";
import {GET_DESIGNATIONS_QUERY, SetGetDesignationsService} from "../designations/designation-gql.service";

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
  departments: any;
  designations: any;
  allDesignations: any;
  isModal: boolean;
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
        {headerName: 'Join Date', field: 'joiningdate', cellRendererFramework: DatetimeComponent},
        {headerName: 'Role', field: 'role'},
        {headerName: 'Action', field: 'action', cellRendererFramework: ActionComponent, cellRendererParams: {
          clicked: (params) => this.actionClick(params)
        }},
    ];
  rowData;
  private gridApi;
  private gridColumnApi;
  private gridOptions: GridOptions;
  xlsColumns = {
    'A': 'firstname',
    'B': 'emmpid',
    'C': 'email',
    'D': 'mobile',
    'E': 'joiningdate',
    'F': 'role',
    'G': 'username',
    'H': 'corporateid',
    'I': 'password'
  };

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
    private importUsersGQL: ImportUsersGQL,
    private setGetDesignationsService: SetGetDesignationsService
  ) {
    this.srch = [];
    this.modules = appService.employee_modules;

    this.getUsers();
    this.getCompanies();
    this.getDepartments();

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
      department: ['', Validators.required],
      designation: ['', Validators.required],
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
        this.getDesignations(); // Don't want to load All beforehand
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
      }
    });
  }

  onDepartChange(event) {
    this.designations = _.filter(this.allDesignations, person => person.department_ID === event.value);
    this.designations && this.editForm.get('designation').enable();
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
    this.apollo.watchQuery({
      query: GET_USERS_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
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
    const data = f.value;
    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    const desig = this.setGetDesignationsService.getDesignations(f.value.designation);
    this.createUserGQL
      .mutate({
        "firstname": data.firstname,
        "lastname": data.lastname,
        "username": data.username,
        "email": data.email,
        "password": data.password,
        "role": data.role,
        "emmpid": data.emmpid,
        "corporateid": data.corporateid,
        "joiningdate": data.joiningdate,
        "department": dprt.department,
        "department_ID": dprt._id,
        "designation": desig.designation,
        "mobile":data.mobile,
        "permissions": {
          "holiday": {
            "read": data.permissions && data.permissions.holiday.read,
            "write": data.permissions && data.permissions.holiday.write
          }
        },
        "modified" : []
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
      "email": email,
      "modified": {
        "modified_by": JSON.parse(sessionStorage.getItem('user')).username,
        "modified_at": Date.now()
      }
    })
    .subscribe( (val: any) => {
      if(!val.data.deleteUser.email) {
        this.getUsers();
      }
    }, error => console.log(error));
  }

  searchID(val) {
    val = val.toString();
    let temp = this.srch.filter(function(d) {
      d.employeeID = d.employeeID.toString();
      return d.employeeID.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  searchName(val) {
    let temp = this.srch.filter(function(d) {
      val = val.toLowerCase();
      return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  searchDesg(val) {
    let temp = this.srch.filter(function(d) {
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  onGridReady(params: any) {
    this.gridOptions = params.gridOptions;
    this.gridApi = params.gridApi;
    this.gridColumnApi = params.gridColumnApi;
  }

  onImportgetData(rowData) {
    rowData.forEach((r, i) => {
      if(r.joiningdate instanceof Date && !isNaN(r.joiningdate)) {
        // console.log('valid Date!');
      } else {
        // console.log('Invalid!'); // But Convert First
        r.joiningdate = moment(r.joiningdate, "DD MM YYYY");
      }
    });

    let uniqArrByEmail = _.difference(rowData, _.uniqBy(rowData, 'email'), 'email');
    let uniqArrByEmmp = _.difference(rowData, _.uniqBy(rowData, 'emmpid'), 'emmpid');
    let uniqArrByUsrn = _.difference(rowData, _.uniqBy(rowData, 'username'), 'username');

    if(uniqArrByEmail.length) {
      console.log('Dupicate Emails');
      console.log(uniqArrByEmail);
    }
    if(uniqArrByEmmp.length) {
      console.log('Dupicate Employee IDs');
      console.log(uniqArrByEmmp);
    }
    if(uniqArrByUsrn.length) {
      console.log('Dupicate Employee Usernames');
      console.log(uniqArrByUsrn);
    }
    if (!uniqArrByEmail.length && !uniqArrByEmmp.length && !uniqArrByEmmp.length) {
      console.log('Success');
      this.insertManyUsers(rowData);
    }

  }

  insertManyUsers(data){
    this.importUsersGQL
      .mutate({
        "input": data,
      })
      .subscribe( (val: any) => {
        if(val.data.insertManyUsers.users[0].username) {
          console.log(val.data);
          setTimeout(_ => this.getUsers() , 1000)
        }
      }, error => setTimeout(_ => this.getUsers() , 1000));
  }

  onFilterTextBoxChanged(filtertextbox) {
    this.gridOptions.api.setQuickFilter(filtertextbox);
  }

}

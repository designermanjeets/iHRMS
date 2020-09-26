import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from '../../app.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Apollo} from "apollo-angular";
import {
  CreateDepartmentGQL,
  DeleteDepartmentGQL,
  GET_DEPARTMENTS_QUERY,
  SetGetDepartmentsService
} from "./department-gql.service";

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

  public srch = [];
  public addD:any = {};
  addDepartmentValidation:boolean = false;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private apollo: Apollo,
    private createDepartmentGQL: CreateDepartmentGQL,
    private deleteDesignationGQL: DeleteDepartmentGQL,
    private setGetDepartmentsService: SetGetDepartmentsService,
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
      }
    });
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

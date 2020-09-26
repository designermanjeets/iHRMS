import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from '../../app.service';
import {
  CreateDesignationGQL, DeleteDesignationGQL,
  GET_DESIGNATIONS_QUERY,
  SetGetDesignationsService
} from "./designation-gql.service";
import { Apollo } from "apollo-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GET_DEPARTMENTS_QUERY} from "../departments/department-gql.service";

declare const $:any;

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {

  rows = [];

  editForm: FormGroup;
  actionParams: any;
  departments: any;

  public srch = [...this.rows];
  public addD:any = {};
  addDesignationValidation:boolean = false;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private apollo: Apollo,
    private createDesignationGQL: CreateDesignationGQL,
    private deleteDesignationGQL: DeleteDesignationGQL,
    private setGetDesignationsService: SetGetDesignationsService,
    private fb: FormBuilder
  ) {
    // this.rows = appService.designations; // No Mock
    // this.srch = [...this.rows];

  }

  ngOnInit() {

    this.editForm = this.fb.group({
      designation: ['', Validators.required],
      department: ['', Validators.required],
    });

    this.getDesignations();
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
    this.editForm.reset();
    $('#add_designation').modal('show');
  }

  actionClickDelete(item) {
    console.log(item)
    this.actionParams = item;
    $('#delete_designation').modal('show');
  }

  onDeleteSub() {
    this.onDelete(this.actionParams._id);
    $('#delete_designation').modal('hide');
    this.actionParams = null;
  }

  addDesignation(f){
    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    this.createDesignationGQL
      .mutate({
        "designation": f.value.designation,
        "department": dprt.department,
        "department_ID": dprt._id,
        "created_at": Date.now(),
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

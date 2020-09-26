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
      }
    });
  }

  addReset(){
    this.addD = { };
    $('#add_designation').modal('show');
  }

  actionClick(params) {
    if(params.type === 'edit') {
      this.onEdit(params.rowData.data);
    }
    if(params.type === 'delete') {
    }
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
    this.createDesignationGQL
      .mutate({
        "designation": f.value.designation,
        "department": f.value.department,
        "created_at": Date.now(),
      })
      .subscribe( (val: any) => {
        if(val.data) {
          console.log(val.data);
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from '../../app.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SetGetDepartmentsService, UpdateDepartmentGQL} from "../departments/department-gql.service";

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css']
})
export class DepartmentDetailsComponent implements OnInit {

  public rows = [];
  editForm: FormGroup;

  public srch = [];
  public uptD:any;
  uptDepartmentValidation:boolean = false;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private setGetDepartmentsService: SetGetDepartmentsService,
    private updateDepartmentsGQL: UpdateDepartmentGQL,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.editForm = this.fb.group({
      department: ['', Validators.required],
    });

    this.route.queryParams.subscribe(params => {
      this.uptD = [];
      if(params.id) {
        const depart = this.setGetDepartmentsService.getDepartments(params.id);
        if(!depart) {
          this.router.navigate(['employees/departments']);
        } else {
          this.uptD = depart;
          this.editForm.patchValue(this.uptD);
        }
      } else {
        this.router.navigate(['employees/departments']);
      }
    });
  }

  updateDepartment(f){
    this.updateDepartmentsGQL
      .mutate({
        "id": this.uptD._id,
        "department": f.value.department,
        "modified": {
          "modified_at": Date.now(),
          "modified_by": JSON.parse(sessionStorage.getItem('user')).username
        }
      })
      .subscribe( (val: any) => {
        if(val.data) {
          console.log(val.data);
          this.router.navigate(['employees/departments']);
        }
      }, error => console.log(error));
  }

}

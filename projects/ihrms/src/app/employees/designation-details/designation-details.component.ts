import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from '../../app.service';
import {SetGetDesignationsService, UpdateDesignationGQL} from "../designations/designation-gql.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-designation-details',
  templateUrl: './designation-details.component.html',
  styleUrls: ['./designation-details.component.css']
})
export class DesignationDetailsComponent implements OnInit {

  rows = [];
  editForm: FormGroup;
  departments: any;

  public srch = [];
  public uptD:any = [];
  uptDesignationValidation:boolean = false;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private setGetDesignationsService: SetGetDesignationsService,
    private updateDesignationGQL: UpdateDesignationGQL,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.editForm = this.fb.group({
      designation: ['', Validators.required],
      department: ['', Validators.required],
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
        }
      } else {
        this.router.navigate(['employees/designations']);
      }
    });
  }

  updateDesignation(f){
    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    this.updateDesignationGQL
      .mutate({
        "id": this.uptD._id,
        "designation": f.value.designation,
        "department": dprt.department,
        "department_ID": dprt._id,
        "modified": {
          "modified_at": Date.now(),
          "modified_by": JSON.parse(sessionStorage.getItem('user')).username
        }
      })
      .subscribe( (val: any) => {
        if(val.data) {
          this.router.navigate(['employees/designations']);
        }
      }, error => console.log(error));
  }
}

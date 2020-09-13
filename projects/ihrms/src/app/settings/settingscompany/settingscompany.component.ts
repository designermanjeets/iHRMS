import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {
  DeleteCompanyGQL,
  GET_COMPANIES_QUERY,
  GET_COMPANY_QUERY,
  RegisterCompanyGQL,
  UpdateCompanyGQL
} from "./companysettingGQL";
import {map} from "rxjs/operators";
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-settingscompany',
  templateUrl: './settingscompany.component.html',
  styleUrls: ['./settingscompany.component.css']
})
export class SettingscompanyComponent implements OnInit {

  companyForm: FormGroup

  uptCompany:boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private registerCompanyGQL: RegisterCompanyGQL,
    private updateCompanyGQL: UpdateCompanyGQL,
    private deleteCompanyGQL: DeleteCompanyGQL,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.companyForm = this.fb.group({
      companyname: ['', Validators.required],
      contactperson: [''],
      address1: [''],
      address2: [''],
      countryid: [''],
      cityid: [''],
      stateid: [''],
      zipcode: [''],
      email: [''],
      phone: [''],
      mobile: [''],
      fax: [''],
      website: ['']
    });
  }

  updateCompany(){
    console.log(this.companyForm.value);
    const form = this.companyForm.value;
    this.updateCompanyGQL
      .mutate({
        "companyname": form.companyname,
        "address1": form.address1,
        "address2": form.address2,
        "countryid": form.countryid,
        "corporateid": "1231"
      })
      .subscribe( val => {
        if(val.data) {
          console.log(val)
          // this.router.navigateByUrl('/dashboard');
          this.uptCompany = true;
        }
      }, error => console.log(error));

  }


  getCompany() {
    this.apollo.watchQuery({
      query: GET_COMPANY_QUERY,
      variables: {
        "corporateid": "123"
      },
    }).valueChanges.subscribe((response) => {
      console.log(response)
    });
  }

  getCompanies() {
    this.apollo.watchQuery({
      query: GET_COMPANIES_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response) => {
      console.log(response)
    });
  }
}

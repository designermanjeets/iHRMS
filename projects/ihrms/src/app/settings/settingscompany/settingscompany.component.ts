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
      printname: [''],
      corporateid: ['', Validators.required],
      address1: [''],
      address2: [''],
      countryid: ['', Validators.required],
      stateid: ['', Validators.required],
      cityid: ['', Validators.required],
      zipcode: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      mobile: [''],
      fax: [''],
      website: [''],
      financialbegindate: ['', Validators.required],
      booksbegindate: ['', Validators.required],
      cinno: ['', Validators.required],
      panno: ['', Validators.required],
      gstin: ['', Validators.required],
      currencyid: ['', Validators.required],
      createdby: ['', Validators.required],
      createdon: ['', Validators.required],
      createdip: ['', Validators.required],
      modifiedby: [''],
      modifiedon: [''],
      modifiedip: [''],
      alias: [''],
    });

    this.getCompany();
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
        "corporateid": JSON.parse(sessionStorage.getItem('user')).corporateid
      },
    }).valueChanges.subscribe((response: any) => {
        console.log(response.data.getCompany);
        this.companyForm.patchValue(response.data.getCompany);
        this.companyForm.patchValue(response.data.getCompany);
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

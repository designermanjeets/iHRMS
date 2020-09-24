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
import {Apollo} from 'apollo-angular';
import {GET_USER_QUERY} from "../../employees/all-employees/employee-gql.service";

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
    private apollo: Apollo,
    private getusequery: GET_USER_QUERY,
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

    this.getUser();
  }

  getUser() {
    this.getusequery.watch({
      "email": JSON.parse(sessionStorage.getItem('user')).email
    }).valueChanges.subscribe((response: any) => {
      if(response.data.user) {
        this.getCompany(response.data.user.corporateid);
      }
    });
  }

  updateCompany(){
    console.log(this.companyForm.value);
    const form = (this.companyForm as FormGroup).value;
    this.updateCompanyGQL
      .mutate({
        "companyname": form.companyname,
        "address1": form.address1,
        "address2": form.address2,
        "countryid": form.countryid,
        "corporateid": form.corporateid,
        "stateid": form.stateid,
        "cityid": form.cityid,
        "zipcode": form.zipcode,
        "email": form.email,
        "financialbegindate": form.financialbegindate,
        "booksbegindate": form.booksbegindate,
        "cinno": form.cinno,
        "panno": form.panno,
        "gstin": form.gstin,
        "currencyid": form.currencyid,
        "modifiedby": form.modifiedby,
        "modifiedon": form.modifiedon,
        "modifiedip": form.modifiedip
      })
      .subscribe( val => {
        if(val.data) {
          console.log(val)
          // this.router.navigateByUrl('/dashboard');
          this.uptCompany = true;
        }
      }, error => console.log(error));

  }


  getCompany(corporateid) {
    this.apollo.watchQuery({
      query: GET_COMPANY_QUERY,
      variables: {
        "corporateid": corporateid
      },
    }).valueChanges.subscribe((response: any) => {
      if(response) {
        this.companyForm.patchValue(response.data.getCompany);
      }
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

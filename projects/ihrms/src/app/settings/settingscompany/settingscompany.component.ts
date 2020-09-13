import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { GET_COMPANY_QUERY, RegisterCompanyGQL} from "./companysettingGQL";
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
    this.registerCompanyGQL
      .mutate({
        "companyname": form.companyname,
        "address1": form.address1,
        "address2": form.address2,
        "countryid": form.countryid,
      })
      .subscribe( val => {
        if(val.data.createCompany.companyname) {
          // this.router.navigateByUrl('/dashboard');
          this.uptCompany = true;
        }
      }, error => console.log(error));

  }


  getCompany() {
    this.apollo.watchQuery({
      query: GET_COMPANY_QUERY,
      variables: {
        "id": "123"
      },
    }).valueChanges.subscribe((response) => {
      console.log(response)
    });
  }
}

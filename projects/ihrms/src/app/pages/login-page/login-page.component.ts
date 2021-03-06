import { Component, OnInit } from '@angular/core';

import { LoginGQL, RegisterGQL } from '../pages.service';
import { Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {throwError} from "rxjs";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup

  constructor(
    private registerGQL: RegisterGQL,
    private loginGQL: LoginGQL,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.router.navigateByUrl('/pages/login');
  }

  ngOnInit() {
    sessionStorage.removeItem('JWT_TOKEN');
    sessionStorage.removeItem('user');

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  register() {
    this.registerGQL
      .mutate({
        "username": "manjeet11",
        "email": "manjeet@singh.com",
        "password": "123",
        "role": "Admin",
        "emmpid": "EMP1",
        "company": "ABCCOMPANY",
        "permissions": {
          "holiday": {
            "read": true,
            "write": true
          }
        }
      })
      .subscribe( val => {
        if(val.data.signup.username) {
          this.router.navigateByUrl('/dashboard');
        }
      }, error => console.log(error));
  }

  login() {
    console.log(this.loginForm.value)
    this.loginGQL
      .mutate({
        "email": this.loginForm.value.email,
        "password": this.loginForm.value.password
      })
      .subscribe( val => {
        console.log(val)
        if(val.data.login.user) {
          sessionStorage.setItem('JWT_TOKEN', val.data.login.token);
          sessionStorage.setItem('user', JSON.stringify({
            email: val.data.login.user.email,
            role: val.data.login.user.role,
            username: val.data.login.user.username
          }));
          this.router.navigateByUrl('/dashboard');
        }
      }, error => console.log(error));
  }

}

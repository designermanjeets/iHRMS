import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChangePasswordGQL} from "./changepassword-gql.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settingspassword',
  templateUrl: './settingspassword.component.html',
  styleUrls: ['./settingspassword.component.css']
})
export class SettingspasswordComponent implements OnInit {

  changeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private changePasswordGQL: ChangePasswordGQL,
    private router: Router
  ) { }

  ngOnInit() {

    this.changeForm = this.fb.group({
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    },
      { validator: this.checkPasswords });

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.newpassword.value;
    let confirmPass = group.controls.confirmpassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }


  changePasswordSubmit(f) {
    this.changePasswordGQL
      .mutate({
        "id": JSON.parse(sessionStorage.getItem('user')).userid,
        "oldPassword": f.value.oldpassword,
        "newPassword": f.value.newpassword,
        "email": JSON.parse(sessionStorage.getItem('user')).email,
      })
      .subscribe( (val: any) => {
        if(val.data.changePassword) {
          console.log(val.data.changePassword);
          this.router.navigateByUrl('./pages/login');
          sessionStorage.setItem('resetpwd', 'true');
        }
      }, error => console.log(error));
  }

}

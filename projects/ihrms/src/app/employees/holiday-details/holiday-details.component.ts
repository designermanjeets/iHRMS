import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from './../../app.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UpdateHolidayGQL} from "../holidays/holidays-gql.service";
import {GetholidaysGQLService} from "../holidays/getholidays-gql.service";

@Component({
  selector: 'app-holiday-details',
  templateUrl: './holiday-details.component.html',
  styleUrls: ['./holiday-details.component.css']
})
export class HolidayDetailsComponent implements OnInit {

  editForm: FormGroup;

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false
  };

  rows = [];
  public srch = [];
  public uptD:any = [];
  uptHolidayValidation:boolean = false;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private getholidaysGQLService: GetholidaysGQLService,
    private updateHolidayGQL: UpdateHolidayGQL,
    private fb: FormBuilder
  ) {
    this.rows = appService.holidays;
    this.srch = [...this.rows];
  }

  ngOnInit() {

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      paid: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.uptD = [];
      if(params._id) {
        const holiday = this.getholidaysGQLService.getHolidays(params._id);
        if(!holiday) {
          this.router.navigate(['employees/holidays']);
        } else {
          this.uptD = holiday;
          this.editForm.patchValue(this.uptD);
        }
      } else {
        this.router.navigate(['employees/holidays']);
      }
    });

  }

  getDayOfWeek(date) {
    //console.log(date);
    var dayOfWeek = new Date(date).getDay();
    //console.log(dayOfWeek)
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  updateHoliday(f){
    this.updateHolidayGQL
      .mutate({
        "id": this.uptD._id,
        "title": f.value.title,
        "paid": f.value.paid,
        "date": f.value.date,
        "day": this.getDayOfWeek(f.value.date),
        "modified": {
          "modified_by": JSON.parse(sessionStorage.getItem('user')).username,
          "modified_at": Date.now()
        }
      })
      .subscribe( (val: any) => {
        if(val.data) {
          console.log(val.data);
          this.router.navigate(['employees/holidays']);
        }
      }, error => console.log(error));
  }

}

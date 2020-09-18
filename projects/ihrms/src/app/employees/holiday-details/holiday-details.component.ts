import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from './../../app.service';
import {FormGroup} from "@angular/forms";
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
    private getholidaysGQLService: GetholidaysGQLService
  ) {
    this.rows = appService.holidays;
    this.srch = [...this.rows];
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.uptD = [];
      if(params.id) {
        const holiday = this.getholidaysGQLService.getHolidays(params.id);
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
    //console.log(f);
    if (f.invalid === true)
      this.uptHolidayValidation = true;
    else {
      this.uptHolidayValidation = false;
    var id = f.form.value.holiday_id;
    //console.log(id);
    var index = this.rows.findIndex(function(item, i){
      return item.holiday_id === id
    });

    //console.log(index);
    if (index > -1) {
        this.rows.splice(index, 1);
    }

    let d = f.form.value.date.formatted.split('-');
    let align_date = ""+d[2]+"-"+d[1]+"-"+d[0];
    //console.log(align_date);
    f.form.value.day = this.getDayOfWeek(align_date);
    f.form.value.status = "upcoming";
    this.uptD = f.form.value;
    this.rows.unshift(f.form.value);
    this.srch.unshift(f.form.value);
    this.rows = this.rows;
    this.router.navigate(['employees/holidays']);
  }
  }

}

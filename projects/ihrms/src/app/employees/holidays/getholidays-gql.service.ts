import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetholidaysGQLService {

  holidays: any;

  constructor() { }

  getHolidays(date) {
    console.log(this.holidays)
    if(!this.holidays) {
      return false;
    } else {
      return this.holidays.find(
        (h: any) => h.date === date);
    }

  }

  setholidays(holidays) {
    this.holidays = holidays;
  }

}

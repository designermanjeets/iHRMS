import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetholidaysGQLService {

  holidays: any;

  constructor() { }

  getHolidays(_id) {
    if(!this.holidays) {
      return false;
    } else {
      return this.holidays.find(
        (h: any) => h._id === _id);
    }

  }

  setholidays(holidays) {
    this.holidays = holidays;
  }

}

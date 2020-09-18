import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from '../../app.service';
import {ActionComponent} from "../../shared/agrid/components/action/action.component";
import {GridOptions} from "ag-grid-community";
import {GET_COMPANIES_QUERY} from "../../settings/settingscompany/companysettingGQL";
import { Apollo } from "apollo-angular";
import {GET_HOLIDAYS_QUERY} from "./holidays-gql.service";
import {GetholidaysGQLService} from "./getholidays-gql.service";

declare const $:any;

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false
  };

  rows = [];
  public srch = [];
  public addD:any = {};
  addHolidayValidation:boolean = false;


  columnDefs = [
    {headerName: 'Title', field: 'title' },
    {headerName: 'Holiday Date', field: 'date'},
    {headerName: 'Day', field: 'day'},
    {headerName: 'Paid', field: 'paid'},
    {headerName: 'Action', field: 'action', cellRendererFramework: ActionComponent, cellRendererParams: {
        clicked: (params) => this.actionClick(params)
      }},
  ];
  rowData;
  private gridApi;
  private gridColumnApi;
  private gridOptions: GridOptions;

  constructor(
    private appService:AppService,
    private router:Router,
    private route:ActivatedRoute,
    private apollo: Apollo,
    private getholidaysGQLService: GetholidaysGQLService
  ) {
    this.rows = appService.holidays;
    this.srch = [...this.rows];
    // this.rowData = appService.holidays;

    console.log(this.rows);
  }

  ngOnInit() {
  this.getHolidays();
  }

  actionClick(params) {
    if(params.type === 'edit') {
      this.onEdit(params.rowData.data);
    }
    if(params.type === 'delete') {
      // this.actionParams = params.rowData.data.email;
      $('#delete_employee').modal('show');
    }
  }

  onGridReady($event) {
    console.log($event);
  }

  getHolidays() {
    this.apollo.watchQuery({
      query: GET_HOLIDAYS_QUERY,
      variables: {
        "pagination": {
          "limit": 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if(response.data.getHolidays[0].title) {
        this.rowData = response.data.getHolidays;
        this.getholidaysGQLService.setholidays(response.data.getHolidays);
      }
    });
  }

  addReset()
  {
    this.addD = {};
    $('#add_holiday').modal('show');
  }

  getDayOfWeek(date) {
    //console.log(date);
    var dayOfWeek = new Date(date).getDay();
    //console.log(dayOfWeek)
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  addHoliday(f){
    //console.log(f);
    //console.log(f.form.value);
    let randomnumber = Math.floor(Math.random() * 99);
    f.form.value.holiday_id = randomnumber;
    if (f.invalid === true)
      this.addHolidayValidation = true;
    else {
      this.addHolidayValidation = false;
    let d = f.form.value.date.formatted.split('-');
    let align_date = ""+d[2]+"-"+d[1]+"-"+d[0];
    f.form.value.day = this.getDayOfWeek(align_date);
    f.form.value.status = "upcoming";
    //console.log(f.form.value.day);
    this.rows.unshift(f.form.value);
    this.srch.unshift(f.form.value);
    this.rows = this.rows;
    $('#add_holiday').modal('hide');
    //console.log(this.rows);
    }
  }

  onEdit(item){
    this.router.navigate(['employees/holidays/edit'], { queryParams: { 'id': item.date } });
  }

  onDelete(id){
    //console.log("="+id+"=");

    var index = this.rows.findIndex(function(item, i){
      return item.holiday_id === id
    });

    //console.log(index);
    if (index > -1) {
        this.rows.splice(index, 1);
        this.srch.splice(index, 1);
    }
    //console.log(this.rows);
    this.rows = this.rows;
  }

}

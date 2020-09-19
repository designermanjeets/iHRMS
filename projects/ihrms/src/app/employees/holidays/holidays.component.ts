import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from '../../app.service';
import {ActionComponent} from "../../shared/agrid/components/action/action.component";
import {GridOptions} from "ag-grid-community";
import { Apollo } from "apollo-angular";
import {DeleteHolidayGQL, GET_HOLIDAYS_QUERY, RegisterHolidayGQL} from "./holidays-gql.service";
import {GetholidaysGQLService} from "./getholidays-gql.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  addForm: FormGroup;
  actionParams: any;

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
    private getholidaysGQLService: GetholidaysGQLService,
    private fb: FormBuilder,
    private registerHolidayGQL: RegisterHolidayGQL,
    private deleteHolidayGQL: DeleteHolidayGQL
  ) {
    this.rows = appService.holidays;
    this.srch = [...this.rows];
    // this.rowData = appService.holidays;

    console.log(this.rows);
  }

  ngOnInit() {
  this.getHolidays();

    this.addForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      paid: ['', Validators.required]
    });
  }

  actionClick(params) {
    if(params.type === 'edit') {
      this.onEdit(params.rowData.data);
    }
    if(params.type === 'delete') {
      this.actionParams = params.rowData.data._id;
      $('#delete_holiday').modal('show');
    }
  }

  onDeleteSub(res) {
    if(res === 'yes') {
      this.onDelete(this.actionParams);
      $('#delete_holiday').modal('hide');
      this.actionParams = null;
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
      if(response.data.getHolidays[0] && response.data.getHolidays[0].title) {
        this.rowData = response.data.getHolidays;
        this.getholidaysGQLService.setholidays(response.data.getHolidays);

        this.rowData.forEach(row => {
          row.day = this.getDayOfWeek(row.date);
        })
      }
    });
  }

  addReset()
  {
    this.addD = {};
    $('#add_holiday').modal('show');
  }

  getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  addHoliday(f){
    console.log(f);

    this.registerHolidayGQL
      .mutate({
        "title": f.value.title,
        "paid": f.value.paid,
        "date": f.value.date,
        "day": this.getDayOfWeek(f.value.date),
      })
      .subscribe( (val: any) => {
        if(val.data.createHoliday) {
          console.log(val.data);
          this.getHolidays(); // fetch latest
          $('#add_holiday').modal('hide');
        }
      }, error => console.log(error));
  }

  onEdit(item){
    this.router.navigate(['employees/holidays/edit'], { queryParams: { '_id': item._id } });
  }

  onDelete(id){
    this.deleteHolidayGQL
      .mutate({
        "id": id
      })
      .subscribe( (val: any) => {
        if(val.data.deleteHoliday) {
          this.getHolidays();
        }
      }, error => console.log(error));
  }

}

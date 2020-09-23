import {ChangeDetectionStrategy, Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {ColumnApi, GridApi, GridOptions} from "ag-grid-community";
import * as XLSX from 'xlsx';
import { UploadOutput, UploadInput, UploadFile, UploaderOptions } from 'ngx-uploader';
import gql from "graphql-tag";
import {Mutation} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class UploadFileGQL extends Mutation {
  document = gql`
   mutation UploadMutation($file: Upload!) {
    uploadFile(file: $file) {
      id,
      filename,
      path,
      mimetype
      }
    }
  `;
}

@Component({
  selector: 'app-agrid',
  templateUrl: './agrid.component.html',
  styleUrls: ['./agrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AgridComponent implements OnInit {

  @Input() rowData;
  @Input() columnDefs;
  @Input() rowHeight;
  @Input() gridOptions;
  @Input() xlsColumns;

  @Output() onGridApiCreated = new EventEmitter();
  @Output() emitRowSelected = new EventEmitter();
  @Output() onLoadData = new EventEmitter();
  @Output() onImportgetData = new EventEmitter();


  private gridApi: GridApi;
  private gridColumnApi: ColumnApi

  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  fileToUpload: File = null;

  constructor(
    private uploadFileGQL: UploadFileGQL
  ) {
    this.options = { concurrency: 1, maxUploads: 3, maxFileSize: 1000000 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  }

  ngOnInit(): void {

  }

  subStr(string, character, position) {
    if(position=='b')
      return string.substring(string.indexOf(character));
    else if(position=='a')
      return string.substring(0, string.indexOf(character));
    else
      return string;
  }

  onGridReady(params: GridOptions) {
    this.gridOptions = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
    // Required
    setTimeout(_ => {
      if(sessionStorage.getItem('uploadpath')) {
        const path = this.subStr(sessionStorage.getItem('uploadpath'), 'assets/','b');
        this.onImport(path);
        sessionStorage.removeItem('uploadpath');
      }
    }, 1);
  }

  onRowSelected($event) {
    this.emitRowSelected.emit($event);
    $event = {};
  }

  sizeToFit() {
    this.onGridApiCreated.emit({
      gridOptions: this.gridOptions,
      gridApi: this.gridApi,
      gridColumnApi: this.gridColumnApi
    })

    this.gridApi.sizeColumnsToFit();

    window.addEventListener('resize', function (){
      setTimeout(function(){
        this.gridApi && this.gridApi.sizeColumnsToFit();
      },1);
    });
  }

  onExport($event) {

  }

  // Export and Import Functionality below
  // Upload First

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        // if you want to auto upload files when added
        // const event: UploadInput = {
        //   type: 'uploadAll',
        //   url: 'http://localhost:3000/graphql/',
        //   method: 'POST',
        //   data: this.files[0]
        // };
        // this.uploadInput.emit(event);
        this.startUpload();
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'done':
        // The file is downloaded
        break;
    }
  }


  // Manual Upload In case you need it
  startUpload() {
    this.uploadFileGQL
      .mutate({
        "file": this.files[0].nativeFile
      })
      .subscribe( (val: any) => {
        if(val.data.uploadFile.path) {
          console.log(val.data.uploadFile.path)
          sessionStorage.setItem('uploadpath', val.data.uploadFile.path);
        }
      }, error => console.log(error));

  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

// XMLHttpRequest in promise format
  makeRequest(method, url, success, error) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.responseType = "arraybuffer";

    httpRequest.open(method, url);
    httpRequest.onload = function () {
      success(httpRequest.response);
    };
    httpRequest.onerror = function () {
      error(httpRequest.response);
    };
    httpRequest.send();
  }

  // read the raw data and convert it to a XLSX workbook
  convertDataToWorkbook(data) {
    /* convert data to binary string */
    data = new Uint8Array(data);
    let arr = [];

    for (let i = 0; i !== data.length; ++i) {
      arr[i] = String.fromCharCode(data[i]);
    }

    const bstr = arr.join("");

    return XLSX.read(bstr, {type: "binary"});
  }


  // pull out the values we're after, converting it into an array of rowData

  populateGrid(workbook) {
    // our data is in the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // we expect the following columns to be present
    const columns = this.xlsColumns; // Should be passed from Parent Component

    let rowData = [];

    // start at the 2nd row - the first row are the headers
    let rowIndex = 2;

    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet['A' + rowIndex]) {
      const row = {};
      Object.keys(columns).forEach(function(column) {
        row[columns[column]] = worksheet[column + rowIndex].w;
      });
      rowData.push(row);
      rowIndex++;
    }

    // finally, set the imported rowData into the grid
    // this.gridOptions.api.setRowData(rowData); // Set From Inside

    // Empty default xlx Columns
    // this.xlsColumns = {};

    // Set From Outside
    this.onImportgetData.emit(rowData);
  }

  onImport(path) {
    const _this = this;
    _this.makeRequest('GET', path,
      // success
      function (data) {
      console.log('success');
        const workbook = _this.convertDataToWorkbook(data);

        _this.populateGrid(workbook);
      },
      // error
      function (error) {
        console.log('error');
        throw error;
      }
    );
  }

}

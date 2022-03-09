import { Component, OnInit } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {

  headers:any[] = [];
  data:any = null;
  constructor(private papa:Papa) { }

  columnDefs: ColDef[] = [];
  rowData:any = [];

  public paginationPageSize = 10;

  ngOnInit(): void {
  }

  onFileSelected(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    
    if (fileList) 
    {
      var file = fileList[0];
      var parseResult : ParseResult = this.papa.parse(file,{
        header: true,
        skipEmptyLines:true,
        //download:true,
        complete: (results) =>
        {
          this.data = results.data
          this.prepareTable()
        }
      });
    }
  }

  prepareTable()
  {
    this.headers = Object.getOwnPropertyNames(this.data[0]);
    this.columnDefs = [];
    this.rowData = [];
    for(let header of this.headers)
    {
      var col = {
        flex: 1,
        field: header,
        sortable: true,
        filter: true,
        editable: true,
        resizable:true,
        minWidth: 100
      }
      this.columnDefs.push(col);
    }
    for(let row of this.data)
    {
      this.rowData.push(row);
    }
  }
}

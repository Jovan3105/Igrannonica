import { Injectable } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class ParsingService {

  constructor(private papa: Papa) { }

  test:object[] = [];
  parsingFile(files:FileList):any
  {
    this.test = [];
    var file = files[0];
    var parseResult : ParseResult = this.papa.parse(file,{
      header: true,
      complete: function(results) 
      {
        console.log(results.data);
      }
    });

  }
}

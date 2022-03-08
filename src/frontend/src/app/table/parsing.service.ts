import { Injectable } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';


@Injectable({
  providedIn: 'root'
})
export class ParsingService {

  constructor(private papa: Papa) { }

  test:any[] = [];
  parsingFile(files:FileList):any
  {
    
    var file = files[0];
    var parseResult : ParseResult = this.papa.parse(file,{
      header: true,
      //download:true,
      complete: (results) =>
      {
        this.getParsedData(results.data);
        for(let i=0; i<results.data.length; i++)
        {
          this.test.push(results.data[i]);
        }
      }
    });
  }

  getParsedData(data:any):any 
  {
    let tabela = document.getElementById('dataPrepTable') as HTMLElement;
    let headerNames = Object.getOwnPropertyNames(data[0]);
    if (tabela) 
    {
      //tabela.innerHTML = data;
    }
    
  }
}

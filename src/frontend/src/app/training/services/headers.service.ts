import { Injectable } from '@angular/core';
import { HeaderDict} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  constructor() { }

  getDataHeader(data : Array<any>) : Array<HeaderDict>{
    
    var tempHeader;
    var newHeader = new Array<HeaderDict>();
    for(let i=0; i<data.length; i++)
    {
      tempHeader = Object.getOwnPropertyNames(data[i]);
      if (tempHeader.length > 0) newHeader.push(new HeaderDict(i,tempHeader[0], data[i][tempHeader[0]]));
    }
    /*
    this.types.forEach((element:any) => {
      tempHeader = Object.getOwnPropertyNames(element);
      if (tempHeader.length > 0) temp.splice(index,0,new HeaderDict(index,tempHeader[0], element[tempHeader[0]]));
      index++;
    });*/
    return newHeader;
  }

  getInfoHeader(data: Array<any>)
  {
    var newHeader = new Array<HeaderDict>();
    var temp;

    if (data.length >= 1)
      temp = Object.getOwnPropertyNames(data[0]);
    else 
      temp = Object.getOwnPropertyNames(data);
    for (let i=0; i<temp.length; i++)
    {
      newHeader.push(new HeaderDict(i,temp[i]));
    }

    return newHeader;
  }
  getStatsHeader(data:Array<any>)
  {

  }
}

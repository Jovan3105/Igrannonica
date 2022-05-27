import { Injectable } from '@angular/core';
import { HeaderDict} from '../models/table_models';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  constructor() { }

  getDataHeader(data : Array<any>) : Array<HeaderDict>{
    
    var tempHeader;
    var newHeader = new Array<HeaderDict>();
    if (data)
    {
      for(let i=0; i<data.length; i++)
      {
        tempHeader = Object.getOwnPropertyNames(data[i]);
        if (tempHeader.length > 0) newHeader.push(new HeaderDict(i,tempHeader[0], data[i][tempHeader[0]]));
      }
    }
    /*
    this.types.forEach((element:any) => {
      tempHeader = Object.getOwnPropertyNames(element);
      if (tempHeader.length > 0) temp.splice(index,0,new HeaderDict(index,tempHeader[0], element[tempHeader[0]]));
      index++;
    });*/
    return newHeader;
  }

  getInfoStatsHeader(data: Array<HeaderDict>)
  {
    var newHeader = new Array<HeaderDict>();
    var temp;

    if (data)
    {
      if (!data.length) return newHeader; 
    
      temp = Object.getOwnPropertyNames(data[0]);
    
      for (let i=0; i<temp.length; i++)
      {
        newHeader.push(new HeaderDict(i,temp[i]));
      }
    }

    return newHeader;
  }

}

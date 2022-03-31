import { Injectable } from '@angular/core';
import { HeaderDict} from '../models/check';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  constructor() { }

  getHeaders(data : Array<any>) : Array<HeaderDict>{
    
    var tempHeader;
    var newHeaders = new Array<HeaderDict>();
    for(let i=0; i<data.length; i++)
    {
      tempHeader = Object.getOwnPropertyNames(data[i]);
      if (tempHeader.length > 0) newHeaders.push(new HeaderDict(i,tempHeader[0], data[i][tempHeader[0]]));
    }
    /*
    this.types.forEach((element:any) => {
      tempHeader = Object.getOwnPropertyNames(element);
      if (tempHeader.length > 0) temp.splice(index,0,new HeaderDict(index,tempHeader[0], element[tempHeader[0]]));
      index++;
    });*/
    return newHeaders;
  }
}

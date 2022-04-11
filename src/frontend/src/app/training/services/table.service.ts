import { Injectable } from '@angular/core';
import { CellValueChangedEvent } from 'ag-grid-community';
import { HeaderDict } from '../models/table_models';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  onCellValueChanged(params:CellValueChangedEvent, data:any, headers:HeaderDict[])
  {
    var colId = parseInt(params.column.getColId());
    var newValue = params.newValue;

    if(headers[colId].type == "int64" || headers[colId].type == "float64")
    {
      if (isNaN(parseInt(newValue))) //postavio string za int ili float, ponistavanje izmene
      {

        data[params.node.id!][headers[colId].name] = params.oldValue;
        params.api.setRowData(data);

        return;

      }
      if (headers[colId].type == "float64")
      {
        newValue = parseFloat(newValue);
        data[params.node.id!][headers[colId].name] = newValue;
      } 
      if (headers[colId].type == "int64") 
      {
        if (parseFloat(newValue)%1 != 0)  //postavio float za int
        {
          newValue = Math.round(parseFloat(newValue)); //postavi zaokruzenu vrednost
          data[params.node.id!][headers[colId].name] = newValue;
          
          params.api.setRowData(data);
        }
        else
        {
          newValue = parseInt(newValue);
          data[params.node.id!][headers[colId].name] = newValue
        } 

      }
    }
    
    return newValue;
  }
  
}

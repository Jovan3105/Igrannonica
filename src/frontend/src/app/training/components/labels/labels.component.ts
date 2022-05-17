import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Check, HeaderDict } from '../../models/table_models';


@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  headers: HeaderDict[] | null;
  pred: number | null;
  @Output() checkEvent: EventEmitter<Check>;                                //podizanje event-a kada se chekira ili unchekira nesto
  @Output() labelEvent: EventEmitter<{ id: number; pred: number | null; }>; //podizanje event-a kada se promeni izlaz
  @Output() selectedEncodings:string[];
  
  selectedLabel:any = null;
  checkboxCheckedArray:boolean[];
  checkboxDisabledArray:boolean[];

  constructor() {

    this.headers = null;
    this.pred = null;
    this.checkEvent = new EventEmitter<Check>();
    this.labelEvent = new EventEmitter<{id:number,pred:number | null}>();
    this.checkboxCheckedArray = new Array<boolean>();
    this.checkboxDisabledArray = new Array<boolean>();
    this.selectedEncodings = new Array<string>();
  }

  ngOnInit(): void {
    this.headers = null;
    this.pred = null;
    this.selectedLabel = null;
    //this.labelEvent = new EventEmitter<{id:number,pred:number}>();
    this.checkboxCheckedArray.splice(0,this.checkboxCheckedArray.length);
    this.checkboxDisabledArray.splice(0,this.checkboxDisabledArray.length);
  }

  onDatasetSelected(headers: Array<HeaderDict>) 
  {
    this.ngOnInit();
    this.headers = headers;
    for(let i = 0; i<headers.length; i++) {
      this.checkboxCheckedArray.push(true);
      this.checkboxDisabledArray.push(false);
      this.selectedEncodings.push("None");
    };
  }

  // poziva se kada se klikne na checkbox
  onCheckChange(event: any) 
  {
    if (event.target.checked)
    {
      this.checkboxCheckedArray[event.target.value] = true;
      this.checkEvent.emit(new Check(event.target.value, true));
    }
    else{
      this.checkboxCheckedArray[event.target.value] = false;
      this.checkEvent.emit(new Check(event.target.value, false));
    }
    
  }

  // poziva se kada se kad se hide-uje iz tabele
  changeCheckbox(checkChange:Check)
  {
    this.checkboxCheckedArray[checkChange.id] = !this.checkboxCheckedArray[checkChange.id];
  }

  onSelectLabel()
  {
    if (this.pred != null)
    {
      this.checkboxDisabledArray[this.pred] = false;
      this.checkboxCheckedArray[this.pred] = true;
    }

    if (this.checkboxCheckedArray[this.selectedLabel.key]) 
      this.checkboxCheckedArray[this.selectedLabel.key] = false;

    this.checkboxDisabledArray[this.selectedLabel.key] = true;
    this.labelEvent.emit({id:parseInt(this.selectedLabel.key),pred:this.pred});
    this.pred = parseInt(this.selectedLabel.key);
    
  }

  getValues(){

    var values;
    var tempHeader = [];
    var features: HeaderDict[] = [];
    var label:HeaderDict[] = [];
    
    if (this.headers)
    {

      for(let i=0; i<this.headers.length; i++)
        if (this.checkboxCheckedArray[i]) 
        {
          tempHeader.push(this.headers[i]);
          //this.selectedEncodings =
        }

      if (this.selectedLabel) 
      {
        features = tempHeader.filter(element => element.key != this.selectedLabel.key);
        label = this.headers.filter(element => element.key == this.selectedLabel.key);
      }
      
      values = {
        "features":features,
        "label":label
      }
    }

    return values;
  }

  onEncodingChange(index: number, encoding: string) {
    if(this.selectedEncodings.length-1 < index) 
      this.selectedEncodings.push(encoding), console.log('Dodat '+ encoding);
    else {
      this.selectedEncodings[index] = encoding;
      console.log("Izmenjen " + index + " na " + encoding)
    }
  }
}

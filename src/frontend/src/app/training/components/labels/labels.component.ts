import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { Check, HeaderDict } from '../../models/table_models';


@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  headers: HeaderDict[] | null;
  pred: number | null;
  missing_categorical:Hyperparameter[] = Constants.MISSING_HANDLER_CATEGORICAL;
  missing_numerical:Hyperparameter[] = Constants.MISSING_HANDLER_NUMERICAL;
  @Input() missing!: number;
  @Output() checkEvent: EventEmitter<Check>; //podizanje event-a kada se chekira ili unchekira nesto
  @Output() labelEvent: EventEmitter<{ id: number; pred: number | null; }>; //podizanje event-a kada se promeni izlaz
  @Output() selectedEncodings:string[];
  @Output() selectedTypes:string[];
  
  selectedLabel:any = null;
  checkboxCheckedArray:boolean[];
  checkboxDisabledArray:boolean[];
  showMissingColumn:boolean = false;
  encodingDisabledArray: boolean[];

  constructor() {

    this.headers = null;
    this.pred = null;
    this.checkEvent = new EventEmitter<Check>();
    this.labelEvent = new EventEmitter<{id:number,pred:number | null}>();
    this.checkboxCheckedArray = new Array<boolean>();
    this.checkboxDisabledArray = new Array<boolean>();
    this.selectedEncodings = new Array<string>();
    this.selectedTypes = new Array<string>();
    this.encodingDisabledArray = new Array<boolean>();
  }

  ngOnInit(): void {
    this.headers = null;
    this.pred = null;
    this.selectedLabel = null;
    if (this.missing > 0) this.showMissingColumn = true;
    else this.showMissingColumn = false;
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
      if(headers[i].type=="numerical")
        this.encodingDisabledArray.push(true);
      else this.encodingDisabledArray.push(false);
    };
  }

  onCheckChange(event: any) 
  {
    //console.log("Podigao se event kad se klikne");
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

  changeCheckbox(checkChange:Check)
  {
    //console.log("Podigao se event kad se hideuje iz tabele");
    console.log(checkChange);
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
  onTypeChange(type:string,i:number)
  {
    console.log(type)
    if(type=="Numerical"){
      this.encodingDisabledArray[i] = true;
    }
    else
    this.encodingDisabledArray[i] = false;
  }
}

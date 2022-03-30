import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Check, HeaderDict } from '../../models/check';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  headers: HeaderDict[] | null;
  pred?:number | null;
  @Output() checkEvent: EventEmitter<Check>;
  @Output() labelEvent: EventEmitter<{ id: number; pred: number; }>;

  constructor() {

    this.headers = null;
    this.pred = null;
    this.checkEvent = new EventEmitter<Check>();
    this.labelEvent = new EventEmitter<{id:number,pred:number}>();

    //const navigation = this.router.getCurrentNavigation();

    /*
    if (navigation)
    {
      this.state = navigation.extras.state;
    }*/
  }

  ngOnInit(): void {
    this.pred = null;
    this.labelEvent = new EventEmitter<{id:number,pred:number}>();
  }

  onDatasetSelected(headers: Array<HeaderDict>) {
    this.headers = headers;
  }

  onCheck(id: number) {
    var checkbox = <HTMLInputElement>document.getElementById('labelCheckbox' + id);
    if (checkbox) {
      if (checkbox.checked) {
        console.log("Menja se");
        this.checkEvent.emit(new Check(id, true));
      }
      else {
        console.log("Menja se");
        this.checkEvent.emit(new Check(id, false));
      }
    }
  }

  changeCheckbox(checkChange:Check)
  {
    var checkbox = <HTMLInputElement>document.getElementById('labelCheckbox' + checkChange.id);
    if (checkbox) {
      if (checkbox.checked) {
        checkbox.checked = false;
      }
      else {
        checkbox.checked = true;
      }
    }
  }

  onSelect()
  {
    var selectedItem = <HTMLInputElement>document.getElementById("selectLabel");

    if (this.pred != null){
      var selectedCheckbox =  <HTMLInputElement>document.getElementById('labelCheckbox' + this.pred);
      selectedCheckbox.disabled = false;
      selectedCheckbox.checked = true;
      this.onCheck(this.pred);
      console.log(this.pred);
      this.pred = null;
    }

    if (selectedItem.value != "-1")
    {
      var selectedCheckbox =  <HTMLInputElement>document.getElementById('labelCheckbox' + selectedItem.value);
      if (selectedCheckbox.checked) selectedCheckbox.checked = false;
      //this.onCheck(parseInt(selectedItem.value));
      selectedCheckbox.disabled = true;
      this.pred = parseInt(selectedItem.value);
      this.labelEvent.emit({id:parseInt(selectedItem.value),pred:this.pred});
    }
  }

  getValues(){

    var values;
    var tempHeader = [];
    if (this.headers)
    {
      var selectedItem = <HTMLInputElement>document.getElementById("selectLabel");

      for(let i=0; i<this.headers.length; i++)
      {
        var selectedCheckbox =  <HTMLInputElement>document.getElementById('labelCheckbox' + this.headers[i].key);
        if (selectedCheckbox.checked) tempHeader.push(this.headers[i]);
      }
      var features = tempHeader.filter(element => element.key != parseInt(selectedItem.value));
      var label = this.headers.filter(element => element.key == parseInt(selectedItem.value));
      values = {
        "features":features,
        "label":label
      }
    }
    return values;
  }

}

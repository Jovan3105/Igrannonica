import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { Check, ChosenColumn, HeaderDict } from '../../models/table_models';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit, OnChanges {

  headers: HeaderDict[] | null;
  pred: number | null;
  missing_categorical:Hyperparameter[] = Constants.MISSING_HANDLER_CATEGORICAL;
  missing_numerical:Hyperparameter[] = Constants.MISSING_HANDLER_NUMERICAL;
  encoding_categorical:Hyperparameter[] = Constants.ENCODING_CATEGORICAL;
  @Input() missing: number = 0;
  @Output() checkEvent: EventEmitter<Check>; //podizanje event-a kada se chekira ili unchekira nesto
  @Output() labelEvent: EventEmitter<{ id: number; pred: number | null; }>; //podizanje event-a kada se promeni izlaz
  selectedEncodings:string[];
  selectedTypes:string[];
  selectedMissingHandler:string[];
  
  targetColumn:any = null;
  checkboxCheckedArray:boolean[];
  checkboxDisabledArray:boolean[];
  showMissingColumn:boolean = false;
  encodingDisabledArray: boolean[];
  constantsDisabledArray:boolean[];
  constantsChoosen:Map<number,string>;

  constructor(public dialog:MatDialog) {

    this.headers = null;
    this.pred = null;
    this.checkEvent = new EventEmitter<Check>();
    this.labelEvent = new EventEmitter<{id:number,pred:number | null}>();
    this.checkboxCheckedArray = new Array<boolean>();
    this.checkboxDisabledArray = new Array<boolean>();
    this.selectedEncodings = new Array<string>();
    this.selectedTypes = new Array<string>();
    this.encodingDisabledArray = new Array<boolean>();
    this.constantsDisabledArray = new Array<boolean>();
    this.selectedMissingHandler = new Array<string>();
    this.constantsChoosen = new Map<number,string>()
  }

  ngOnInit(): void {
    this.headers = null;
    this.pred = null;
    this.targetColumn = null;

    //this.labelEvent = new EventEmitter<{id:number,pred:number}>();
    this.checkboxCheckedArray.splice(0,this.checkboxCheckedArray.length);
    this.checkboxDisabledArray.splice(0,this.checkboxDisabledArray.length);
    this.encodingDisabledArray.splice(0,this.encodingDisabledArray.length);
    this.selectedTypes.splice(0,this.selectedTypes.length);
    this.selectedEncodings.splice(0,this.selectedEncodings.length);
    this.selectedMissingHandler.splice(0,this.selectedMissingHandler.length);
    this.constantsDisabledArray.splice(0,this.constantsDisabledArray.length);
    this.constantsChoosen.clear();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.missing > 0) 
      this.showMissingColumn = true;
    else this.showMissingColumn = false;
    if (this.showMissingColumn)
    {
      if (this.headers)
      {
        for(let i = 0; i<this.headers.length; i++) {
          if(this.headers[i].type=="int64" || this.headers[i].type=="float64")
          {
            this.selectedMissingHandler[i] = this.missing_numerical[0].codename;
          }
          else 
          {
            this.selectedMissingHandler[i] = this.missing_categorical[0].codename;
            
          }
        }
      }
      
    }
  }

  onDatasetSelected(headers: Array<HeaderDict>) 
  {
    this.ngOnInit();
    this.headers = headers;
    for(let i = 0; i<headers.length; i++) {
      this.checkboxCheckedArray.push(true);
      this.checkboxDisabledArray.push(false);
      this.constantsDisabledArray.push(true);
      if(headers[i].type=="int64" || headers[i].type=="float64")
      {
        this.encodingDisabledArray.push(true);
        this.selectedTypes.push("Numerical");
        this.selectedEncodings.push("None");
      }
      else 
      {
        this.encodingDisabledArray.push(false);
        this.selectedTypes.push("Categorical");
        this.selectedEncodings.push(this.encoding_categorical[0].codename);
      }
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

    if (this.checkboxCheckedArray[this.targetColumn.key]) 
      this.checkboxCheckedArray[this.targetColumn.key] = false;

    this.checkboxDisabledArray[this.targetColumn.key] = true;
    this.labelEvent.emit({id:parseInt(this.targetColumn.key),pred:this.pred});
    this.pred = parseInt(this.targetColumn.key);
  }

  getChoosenCols(){
    var values;
    var features: ChosenColumn[] = [];
    var label: ChosenColumn | undefined = undefined;
    
    
    if (this.headers)
    {

      for(let i=0; i<this.headers.length; i++)
        if (this.checkboxCheckedArray[i]) 
        {
          if (this.showMissingColumn)
          {
            if(!this.constantsDisabledArray[i])
            {
              features.push(new ChosenColumn(this.headers[i].name,
                                            this.selectedTypes[i],
                                            this.selectedEncodings[i],
                                            this.selectedMissingHandler[i],
                                            this.constantsChoosen.get(i)));
            }
            else 
              features.push(new ChosenColumn(this.headers[i].name,
                this.selectedTypes[i],
                this.selectedEncodings[i],
                this.selectedMissingHandler[i]));
          }
          else 
            features.push(new ChosenColumn(this.headers[i].name,this.selectedTypes[i],this.selectedEncodings[i]));
        }
      

      if (this.targetColumn) 
      {
        let id = this.targetColumn.key;
        let lblName = this.headers.filter(element => element.key == this.targetColumn.key)[0].name;
        if (this.showMissingColumn)
        {
          if(!this.constantsDisabledArray[id])
            label = new ChosenColumn(lblName,this.selectedTypes[id],this.selectedEncodings[id],this.selectedMissingHandler[id],
              this.constantsChoosen.get(id));
          else 
          label = new ChosenColumn(lblName,this.selectedTypes[id],this.selectedEncodings[id],this.selectedMissingHandler[id]);
        }
        else label = new ChosenColumn(lblName,this.selectedTypes[id],this.selectedEncodings[id]);
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
      this.selectedTypes[i] = "Numerical";
      this.selectedEncodings[i] = "None";
      this.selectedMissingHandler[i] = this.missing_numerical[0].codename;
    }
    else
    {
      this.encodingDisabledArray[i] = false;
      this.selectedTypes[i] = "Categorical";
      this.selectedEncodings[i] = "OneHot";
      this.selectedMissingHandler[i] = this.missing_categorical[0].codename;
    }
      
  }
  onMissingChange(index:number,missing_selection:string)
  {
    this.selectedMissingHandler[index] = missing_selection;

    if (missing_selection == "Constant")
    {
      var dialogTitle = "Constant for '" + this.headers![index].name + "' column";
      var dialogMessage = "Add constant you would like to fill missing values with";
      const dialogRef = this.dialog.open(DialogComponent, 
        {
          data: { title: dialogTitle, message: dialogMessage, input:true }
        });
      dialogRef.afterClosed().subscribe(result => {

        if (result != undefined){
          this.constantsDisabledArray[index] = false;
          this.constantsChoosen.set(index, result);
        }
        else{
          this.selectedMissingHandler[index] = this.missing_categorical[0].codename;
        }
      });
    }
  }
  deleteConstant(index:number)
  {
    this.constantsDisabledArray[index] = true;
    this.constantsChoosen.delete(index);
    this.selectedMissingHandler[index] = this.missing_categorical[0].codename;
  }
}

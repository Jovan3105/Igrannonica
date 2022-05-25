import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Constants, Hyperparameter } from '../../models/hyperparameter_models';
import { Check, ChosenColumn, HeaderDict } from '../../models/table_models';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit, OnChanges {

  columns: HeaderDict[] | null;
  previousTargetId: number | null;
  missing_categorical:Hyperparameter[] = Constants.MISSING_HANDLER_CATEGORICAL;
  missing_numerical:Hyperparameter[] = Constants.MISSING_HANDLER_NUMERICAL;
  encoding_categorical:Hyperparameter[] = Constants.ENCODING_CATEGORICAL;
  @Input() missing: number = 0;
  @Input() missing_incidator : boolean = false;
  @Output() checkEvent: EventEmitter<Check>; //podizanje event-a kada se chekira ili unchekira nesto
  @Output() labelEvent: EventEmitter<{ id: number; previousTargetId: number | null; }>; //podizanje event-a kada se promeni izlaz
  selectedEncodings:string[];
  selectedTypes:string[];
  selectedMissingHandler:string[];
  
  selectAllTrigger: boolean = false;
  targetColumn:any = null;
  checkboxCheckedArray:boolean[];
  showMissingColumn:boolean = false;
  encodingDisabledArray: boolean[];
  constantsDisabledArray:boolean[];
  constantsChoosen:Map<number,string>;
  keep_state:boolean = false;

  constructor(public dialog:MatDialog, private sessionService:SessionService) {

    this.columns = null;
    this.previousTargetId = null;
    this.checkEvent = new EventEmitter<Check>();
    this.labelEvent = new EventEmitter<{id:number,previousTargetId:number | null}>();
    this.checkboxCheckedArray = new Array<boolean>();
    this.selectedEncodings = new Array<string>();
    this.selectedTypes = new Array<string>();
    this.encodingDisabledArray = new Array<boolean>();
    this.constantsDisabledArray = new Array<boolean>();
    this.selectedMissingHandler = new Array<string>();
    this.constantsChoosen = new Map<number,string>()
  }

  ngOnInit(): void {
    this.columns = null;
    this.previousTargetId = null;
    this.targetColumn = null;

    this.resetValues();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.missing > 0) 
      this.showMissingColumn = true;
    else this.showMissingColumn = false;

    if (this.showMissingColumn)
    {
      if (this.columns)
      {
        for(let i = 0; i<this.columns.length; i++) {
          if(this.columns[i].type=="int64" || this.columns[i].type=="float64")
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

  onDatasetSelected(columns: Array<HeaderDict>) 
  {
    if (!this.keep_state)
    {
      this.ngOnInit();
      this.columns = columns;
      this.sessionService.saveData('columns', JSON.stringify(this.columns));
      for(let i = 0; i<columns.length; i++) {
        this.checkboxCheckedArray.push(true);
        this.constantsDisabledArray.push(true);
        if(columns[i].type=="int64" || columns[i].type=="float64")
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
    else{
      this.keep_state = false;
      for(let i = 0; i < this.checkboxCheckedArray.length; i++)
      {
        if (this.checkboxCheckedArray[i] == false && i != this.targetColumn.key) this.checkEvent.emit(new Check(i, false));
      }
    }

    this.sessionService.saveData('selected_checkboxes', JSON.stringify(this.checkboxCheckedArray));
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

  // poziva se kada se kad se dogodi hideEvent tabele
  changeCheckbox(checkChange:Check)
  {
    this.checkboxCheckedArray[checkChange.id] = !this.checkboxCheckedArray[checkChange.id];
  }

  onLabelColSelect()
  {
    if (this.previousTargetId != null)
    {
      this.checkboxCheckedArray[this.previousTargetId] = true;
    }

    if(this.targetColumn!=null){
      if (this.checkboxCheckedArray[this.targetColumn.key]) 
      this.checkboxCheckedArray[this.targetColumn.key] = false;

      this.labelEvent.emit({id:parseInt(this.targetColumn.key),previousTargetId:this.previousTargetId});
      this.previousTargetId = parseInt(this.targetColumn.key);

      let encoding = this.selectedEncodings[this.targetColumn.key];

      if(encoding != 'OneHot')
        this.selectedEncodings[this.targetColumn.key] = 'OneHot';

      this.sessionService.saveData('target_column', JSON.stringify(this.targetColumn));
    }
  }

  getChoosenCols(){
    var values;
    var features: ChosenColumn[] = [];
    var label: ChosenColumn | undefined = undefined;
    
    if (this.columns)
    {
      for(let i=0; i<this.columns.length; i++)
        if (this.checkboxCheckedArray[i]) 
        {
          if (this.showMissingColumn)
          {
            if(!this.constantsDisabledArray[i])
            {
              features.push(new ChosenColumn(this.columns[i].name,
                                            this.selectedTypes[i],
                                            this.selectedEncodings[i],
                                            this.selectedMissingHandler[i],
                                            this.constantsChoosen.get(i)));
            }
            else 
              features.push(new ChosenColumn(this.columns[i].name,
                this.selectedTypes[i],
                this.selectedEncodings[i],
                this.selectedMissingHandler[i]));
          }
          else 
            features.push(new ChosenColumn(this.columns[i].name,this.selectedTypes[i],this.selectedEncodings[i]));
        }
      

      if (this.targetColumn) 
      {
        let id = this.targetColumn.key;
        let lblName = this.columns.filter(element => element.key == this.targetColumn.key)[0].name;
        
        if (this.showMissingColumn)
        {
          if(!this.constantsDisabledArray[id])
            label = new ChosenColumn(
                lblName,
                this.selectedTypes[id],
                this.selectedEncodings[id],
                this.selectedMissingHandler[id],
                this.constantsChoosen.get(id));
          else 
            label = new ChosenColumn(
              lblName,
              this.selectedTypes[id],
              this.selectedEncodings[id],
              this.selectedMissingHandler[id]);
        }
        else label = new ChosenColumn(lblName, this.selectedTypes[id], this.selectedEncodings[id]);
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
      this.selectedEncodings.push(encoding);
    else {
      this.selectedEncodings[index] = encoding;
    }
  }

  onTypeChange(type:string,i:number)
  {
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

  onMissingChange(index:number,selectedFillMethod:string)
  {
    console.log("Je l radi");
    console.log(selectedFillMethod);
    this.selectedMissingHandler[index] = selectedFillMethod;

    if (selectedFillMethod == "constant_str")
    {
      var dialogTitle = "Constant for '" + this.columns![index].name + "' column";
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

  selectAll(){
    for (let index = 0; index < this.checkboxCheckedArray.length; index++) {
      if(this.targetColumn==null || this.targetColumn.key!=index)
      {
      this.checkboxCheckedArray[index] = true;
      this.checkEvent.emit(new Check(index, true));
      }
    }
  }

  unselectAll(){
    for (let index = 0; index < this.checkboxCheckedArray.length; index++) {
      if(this.targetColumn==null || this.targetColumn.key!=index)
      {
        this.checkboxCheckedArray[index] = false;
        this.checkEvent.emit(new Check(index, false));
      }
    }
  }
      
  resetValues()
  {
    this.checkboxCheckedArray.splice(0,this.checkboxCheckedArray.length);
    this.encodingDisabledArray.splice(0,this.encodingDisabledArray.length);
    this.selectedTypes.splice(0,this.selectedTypes.length);
    this.selectedEncodings.splice(0,this.selectedEncodings.length);
    this.selectedMissingHandler.splice(0,this.selectedMissingHandler.length);
    this.constantsDisabledArray.splice(0,this.constantsDisabledArray.length);
    this.constantsChoosen.clear();
  }
}

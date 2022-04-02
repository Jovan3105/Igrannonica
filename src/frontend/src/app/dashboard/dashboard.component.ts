import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DatasetService } from '../training/services/dataset.service';
import { Router } from '@angular/router';
import { ShowTableComponent } from '../training/components/show-table/show-table.component';
import { style } from '@angular/animations';
import { LabelsComponent } from '../training/components/labels/labels.component';
import { Check } from '../training/models/check';
import { HeadersService } from '../training/services/headers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  toggledButton: boolean = true

  constructor(private datasetService: DatasetService, private router: Router, private headersService: HeadersService) { }
  //@ViewChild(ShowTableComponent,{static: true}) private dataTable!: ShowTableComponent;
  @ViewChild('dataTable') private dataTable!: ShowTableComponent;
  @ViewChild('numIndicators') private numIndicators!: ShowTableComponent;
  @ViewChild('dataSetInformation') private dataSetInformation!: ShowTableComponent;
  @ViewChild('catIndicators') private catIndicators!: ShowTableComponent;
  @ViewChild('Labels') private labels!: LabelsComponent;

  public form: FormData = new FormData();
  
  public featuresLabel:any;
  //activateModal:boolean = false;

  fetchTableDataObserver:any = {
    next: (response:any) => { 
      var circle = document.getElementById('circle');
      circle!.style.display = "none";
      var container = document.getElementById('mainContainer');
      container!.style.visibility = "visible";
      (document.getElementById('nextButton') as HTMLInputElement).disabled = false;
      console.log("Gotovo1")
      console.log(response)
        
      var headers = this.headersService.getHeaders(response['columnTypes'])
      this.dataTable.prepareTable(response['parsedDataset'], headers)
      this.labels.ngOnInit();
      this.labels.onDatasetSelected(headers);

      this.dataSetInformation.prepareTable([response['basicInfo']], headers)
      this.dataSetInformation.columnDefs.forEach(element => {
        element['editable'] = false;
        element['resizable'] = false;
      });
      
      this.dataSetInformation.changeAttributeValue("height: 100px;",undefined,undefined,undefined,false,1,false,false,true)
      this.numIndicators.changeAttributeValue(undefined,undefined,undefined,undefined,false,undefined,undefined,undefined,true)
      this.catIndicators.changeAttributeValue(undefined,undefined,undefined,undefined,false,undefined,undefined,undefined,true)
      
      // TODO ispraviti kada se omoguci povratak ID-a
      this.datasetService.getStatIndicators(22).subscribe(this.fetchStatsDataObserver);
      var buttons = document.getElementById('buttons')
      buttons!.style.display = "block";
    },
    error: (err: Error) => {
      console.log(err)

    }
  };
  fetchStatsDataObserver:any = {
    next: (response:any) => { 
      console.log("Gotovo2")
        console.log(response)
        var headers = this.headersService.getHeaders(response['columnTypes'])

        this.numIndicators.prepareTable(response['continuous'], headers) 
        this.numIndicators.columnDefs.forEach(element => {
          element['editable'] = false;
          element['resizable'] = false;
        });

        this.catIndicators.prepareTable(response['categorical'], headers) 
        this.catIndicators.columnDefs.forEach(element => {
          element['editable'] = false;
          element['resizable'] = false;
        });
        
        
    },
    error: (err: Error) => {
      console.log(err)

    }
  };
  ngOnInit(): void {
  }
  onFileSelected(event:Event)
  {
    if (this.form.get('file')) this.form.delete('file');
    var circle = document.getElementById('circle');
    var container = document.getElementById('mainContainer');
    circle!.style.display = "block";
    container!.style.visibility = "hidden";

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;


    if (fileList && fileList?.length > 0) {

      var file = fileList[0];

      this.form.append('file', file);
      this.datasetService.uploadDataset(this.form)
      .subscribe(this.fetchTableDataObserver);
    }
  }


  onRemoveSelected() {
    this.dataTable.onRemoveSelected();
  }

  onShowDataClick() {

    var circle = document.getElementById('circle');
    circle!.style.display = "block";
    var container = document.getElementById('mainContainer');
    container!.style.visibility = "hidden";
    (document.getElementById('nextButton') as HTMLInputElement).disabled = true;
    

    var datasetURL = (<HTMLInputElement>document.getElementById('dataset-url'));
    if (datasetURL == null || datasetURL.value == "")
      console.log("problem: dataset-url");
    else {
      var req = {
        "public": true,
        "userID": 0,
        "description": "string",
        "name": "string",
        "datasetSource": datasetURL.value,
        "delimiter": null,
        "lineTerminator": null,
        "quotechar": null,
        "escapechar": null,
        "encoding": null
      }
      
      this.datasetService.parseDataset(req).subscribe(this.fetchTableDataObserver);
    }
  }

  toggleTables(){
    var numbericalTable = document.getElementById('numerical');
    var mainTable = document.getElementById('mainTable');
    var basicTable = document.getElementById('basicInfo');
    var statsButton = document.getElementById('statsButton');
    var deleteButton = document.getElementById('deleteButton');
    var categoricalTable = document.getElementById('categorical');
    var labelCards = document.getElementById('labelCards');
    if(this.toggledButton){
      numbericalTable!.style.display = "block"
      basicTable!.style.display = "block"
      mainTable!.style.display = "none"
      categoricalTable!.style.display = "block"
      statsButton!.innerHTML = "Show table"
      deleteButton!.style.display = "none";
      labelCards!.style.display = "none";
    }
    else{
      numbericalTable!.style.display = "none"
      basicTable!.style.display = "none"
      mainTable!.style.display = "block"
      categoricalTable!.style.display = "none"
      statsButton!.innerHTML = "Show stats"
      deleteButton!.style.display = "inline-block";
      labelCards!.style.display = "block";
    }
    this.toggledButton = !this.toggledButton
  }


  OnNextClick() {

    var temp = this.labels.getValues(); // Cuva se objekat sa odabranim feature-ima i labelom

    if (temp!.label.length > 0){
      this.featuresLabel = temp;
      console.log(this.featuresLabel);
      //Pokreni modal
      
    }
    else{
      alert("Nisi izabrao izlaz!");
    }
    

    //this.router.navigate(['/labels'], { state: this.dataTable.headers });

  }

  onSaveClick()
  {

  }
  
  changeColomnVisibility(checkChange: Check) {
    this.dataTable.changeColomnVisibility(checkChange.id.toString(), checkChange.visible);
  }

  changeCheckBox(checkChange: Check) {
    this.labels.changeCheckbox(checkChange)
  } 

  onSelectedLabel(data:{id:number,pred:number})
  {
    this.dataTable.changeLabelColumn(data);
  }
}

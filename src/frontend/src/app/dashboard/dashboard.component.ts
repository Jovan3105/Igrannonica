import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DatasetService } from '../training/services/dataset.service';
import { Router } from '@angular/router';
import { ShowTableComponent } from '../training/components/show-table/show-table.component';
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
  @ViewChild('catIndicators') private catIndicators!: ShowTableComponent;
  @ViewChild('Labels') private labels!: LabelsComponent;

  public form: FormData = new FormData();
  
  public featuresLabel:any;
  //activateModal:boolean = false;

  ngOnInit(): void {
  }
  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;


    if (fileList && fileList?.length > 0) {

      var file = fileList[0];

      this.form.append('file', file);

      this.datasetService.uploadDataset(this.form)
        .subscribe({
          next: (response: any) => {
            console.log("Dataset je upload-ovan");
            console.log(response);
            var headers = this.headersService.getHeaders(response['columnTypes']);
            this.dataTable.prepareTable(response['parsedDataset'], headers);
            this.labels.ngOnInit();
            this.labels.onDatasetSelected(headers);
            var buttons = document.getElementById('buttons')
            buttons!.style.display = "block";
          },
          error: (e) => console.error(e)
        });
    }
  }


  onRemoveSelected() {
    this.dataTable.onRemoveSelected();
  }

  onShowDataClick() {

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

      const fetchTableDataObserver = {
        next: (response: any) => {
          console.log("Gotovo1")
          console.log(response);
          var headers = this.headersService.getHeaders(response['columnTypes']);
          this.dataTable.prepareTable(response['parsedDataset'], headers);
          this.labels.ngOnInit();
          this.labels.onDatasetSelected(headers);
          //this.datasetService.getStatIndicators(2).subscribe(fetchStatsDataObserver);
          var buttons = document.getElementById('buttons')
          buttons!.style.display = "block";
        },
        error: (err: Error) => {
          console.log(err)

        }
      };
      const fetchStatsDataObserver = {
        next: (response: any) => {
          console.log("Gotovo2")
          console.log(response)
          //this.numIndicators.prepareTable(response['continuous'])
        },
        error: (err: Error) => {
          console.log(err)

        }
      };

      this.datasetService.parseDataset(req).subscribe(fetchTableDataObserver);

    }


  }

  toggleTables() {
    var statsTable = document.getElementById('numerical');
    var mainTable = document.getElementById('mainTable');
    var statsButton = document.getElementById('statsButton');
    var deleteButton = document.getElementById('deleteButton');
    if (this.toggledButton) {
      statsTable!.style.display = "block"
      mainTable!.style.display = "none"
      statsButton!.innerHTML = "Show table"
      deleteButton!.style.display = "none";
    }
    else {
      statsTable!.style.display = "none"
      mainTable!.style.display = "block"
      statsButton!.innerHTML = "Show stats"
      deleteButton!.style.display = "inline-block";
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

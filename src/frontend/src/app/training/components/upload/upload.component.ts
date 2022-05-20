import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';



@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file?:File;
  fileName?:string;
  datasetURL:string;
  isLoggedIn:boolean;
  showDragAndDrop:boolean;

  diamondsURL:string;
  titanicURL:string;
  weightsURL:string;
  covidURL:string;
  browserURL:string;

  @Output() linkEvent: EventEmitter<string>; //podizanje event-a kada se salje link
  @Output() uploadEvent: EventEmitter<File>; //podizanje event-a kada se salje file

  constructor(private authService : AuthService) {
    this.datasetURL = "";
    this.linkEvent = new EventEmitter<string>();
    this.uploadEvent = new EventEmitter<File>();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.showDragAndDrop = true;
    this.diamondsURL = "https://raw.githubusercontent.com/tidyverse/ggplot2/main/data-raw/diamonds.csv"
    this.titanicURL = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv";
    this.weightsURL = "https://raw.githubusercontent.com/kintan-pitaloka/weight-height-dataset/main/weight-height.csv";
    this.covidURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv";
    this.browserURL = "https://raw.githubusercontent.com/datasets/browser-stats/master/data.csv";
   }

  ngOnInit(): void 
  {

  }

  fileHandler(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;


    if (fileList && fileList?.length > 0) {

      this.file = fileList[0];

    }
    this.showDragAndDrop = false;
  }

  onFileDropped(file:File)
  {
    this.file = file;
    this.showDragAndDrop = false;
  }

  uploadClick()
  {
    this.uploadEvent.emit(this.file);
    this.fileName = this.file?.name;
  }
  
  linkClick()
  {
    this.linkEvent.emit(this.datasetURL);
    this.fileName = this.datasetURL.split("/").pop();
  }
  removeFile()
  {
    this.file = undefined;
    this.showDragAndDrop = true;
  }
  publicLinkClick(datasetLink:string)
  {
    this.linkEvent.emit(datasetLink);
    this.fileName = datasetLink.split("/").pop();
  }
}

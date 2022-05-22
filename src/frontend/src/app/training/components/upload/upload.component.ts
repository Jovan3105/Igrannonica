import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DatasetInfoComponent } from '../dataset-info/dataset-info.component';
import { SessionService } from 'src/app/core/services/session.service';



@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file?:File;
  fileName?:string;
  fileSize?:string;
  datasetURL:string = "";
  isLoggedIn:boolean;
  showDragAndDrop:boolean = true;
  tab_index:number = 0;
  diamondsURL:string;
  titanicURL:string;
  weightsURL:string;
  covidURL:string;
  browserURL:string;
  @Output() linkEvent: EventEmitter<string>; //podizanje event-a kada se salje link
  @Output() uploadEvent: EventEmitter<File>; //podizanje event-a kada se salje file

  constructor(private authService : AuthService, public sessionService:SessionService) {
    this.fileName = "";
    this.datasetURL = "";
    this.linkEvent = new EventEmitter<string>();
    this.uploadEvent = new EventEmitter<File>();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.showDragAndDrop = true;
    this.diamondsURL = "https://raw.githubusercontent.com/tidyverse/ggplot2/main/data-raw/diamonds.csv"
    this.titanicURL = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv";
    this.weightsURL = "https://raw.githubusercontent.com/TodorovicSrdjan/weight-height-dataset/main/weight-height.csv";
    this.covidURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv";
    this.browserURL = "https://raw.githubusercontent.com/datasets/browser-stats/master/data.csv";
   }

  ngOnInit(): void 
  {
    if (this.sessionService.getData('tab_index') != null)
      this.tab_index = parseInt(this.sessionService.getData('tab_index')!);
    else
      this.sessionService.saveData('tab_index',this.tab_index.toString());

    if (this.sessionService.getData('file_name') != null)
    {
      this.fileName = this.sessionService.getData('file_name')!;
      console.log(this.sessionService.getData('file_size'));
      if (this.sessionService.getData('file_size') != null)
      {
        //console.log("Upadam"); 
        this.fileSize = this.sessionService.getData('file_size')!;
        this.showDragAndDrop = false;
      }
      
    }
    if(this.sessionService.getData('upload_link') != null)
    {
      this.datasetURL = this.sessionService.getData('upload_link')!;
    }
  }

  fileHandler(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;


    if (fileList && fileList?.length > 0) {

      this.file = fileList[0];
      this.fileName = this.file.name;
      this.fileSize = this.convertFileSize(this.file.size);
    }
    this.showDragAndDrop = false;
  }

  onFileDropped(file:File)
  {
    this.file = file;
    this.fileName = this.file.name;
    this.fileSize = this.convertFileSize(this.file.size);
    this.showDragAndDrop = false;

    this.fileName = file.name;
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
    this.clearSessionStorage();
    this.file = undefined;
    this.showDragAndDrop = true;
  }

  setIndex(index:number)
  {
    this.tab_index = index;
    this.sessionService.saveData('tab_index',this.tab_index.toString());
  }

  clearSessionStorage()
  {
    this.sessionService.removeData('file_name');
    this.sessionService.removeData('file_size');
  }
  convertFileSize(bytes : number, si : boolean = true, dp : number = 1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }
  
  publicLinkClick(datasetLink:string)
  {
    this.linkEvent.emit(datasetLink);
    this.fileName = datasetLink.split("/").pop();
  }
}

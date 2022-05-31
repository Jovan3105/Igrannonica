import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  linkName:string = "";
  name:string = "";
  datasetName?:string="";
  datasetDescription?:string="";
  fileSize?:string;
  datasetURL:string = "";

  isLoggedIn:boolean;
  showDragAndDrop:boolean = true;
  tab_index:number = 0;
  newFileBool:boolean = true;
  newLinkBool:boolean = true;

  diamondsURL:string;
  titanicURL:string;
  weightsURL:string;
  covidURL:string;
  browserURL:string;
  
  @Input() badLinkErrorDisplay: boolean = false;
  @Input() errorMessage: string = '';
  @Output() linkEvent: EventEmitter<string>; //podizanje event-a kada se salje link
  @Output() uploadEvent: EventEmitter<any>; //podizanje event-a kada se salje file
  @Output() datasetSelectedEvent: EventEmitter<{ isSelected: boolean, datasetSource: string }>;

  constructor(private authService : AuthService, public sessionService:SessionService) {
    this.fileName = "";
    this.datasetURL = "";
    this.linkEvent = new EventEmitter<string>();
    this.uploadEvent = new EventEmitter<File>();
    this.datasetSelectedEvent = new EventEmitter<{ isSelected: boolean, datasetSource: string }>();
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
      //console.log(this.sessionService.getData('file_size'));
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

  updateDatasetName(value:string)
  {
    this.datasetName=value;
  }

  updateDatasetDescription(value:string)
  {
    this.datasetDescription=value;
  }

  fileHandler(event:Event)
  {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList && fileList?.length > 0) {

    this.file = fileList[0];
    this.fileName = this.name = this.file.name;
    this.fileSize = this.convertFileSize(this.file.size);

    let fileNameToTitle = this.fileName;
    fileNameToTitle = fileNameToTitle!.replace(/\.[^/.]+$/, '');
    fileNameToTitle = fileNameToTitle.charAt(0).toUpperCase() + fileNameToTitle.slice(1);
    this.datasetDescription = fileNameToTitle;
    this.datasetName = fileNameToTitle;
    }

    this.showDragAndDrop = false;

    // TODO proveriti ovaj deo koda

    if(this.file == null)
      this.datasetSelectedEvent.emit({ isSelected: false, datasetSource: "local_upload"});
    else  
      this.datasetSelectedEvent.emit({ isSelected: true, datasetSource: "local_upload"});

    this.newFileBool = true;
  }

  onFileDropped(file:File)
  {
    this.file = file;
    this.fileName = this.name = file.name;
    this.fileSize = this.convertFileSize(file.size);
    this.showDragAndDrop = false;
    this.newFileBool = true;

    let fileNameToTitle = this.fileName;
    fileNameToTitle = fileNameToTitle!.replace(/\.[^/.]+$/, '');
    fileNameToTitle = fileNameToTitle.charAt(0).toUpperCase() + fileNameToTitle.slice(1);
    this.datasetDescription = fileNameToTitle;
    this.datasetName = fileNameToTitle;
  }

  uploadClick()
  {
    if (this.newFileBool)
    {
      this.uploadEvent.emit({
        file:this.file,
        name:this.datasetName,
        description:this.datasetDescription,
        public:true
      });

      this.fileName = this.name = this.file?.name!;
      this.newFileBool = false;
      this.newLinkBool = true;
    }
    else{
      this.uploadEvent.emit({
        file:undefined,
        name:this.datasetName,
        description:this.datasetDescription,
        public:true
      });
    }
  }
  
  linkClick()
  {
    if (this.newLinkBool)
    {
      this.linkEvent.emit(this.datasetURL);
      this.linkName = this.name = this.datasetURL.split("/").pop()!;
      this.newLinkBool = false;
      this.newFileBool = true;
    }
    else{
      this.linkEvent.emit(undefined);
    }

  }

  removeFile()
  {
    this.clearSessionStorage();
    this.file = undefined;
    this.fileName="";
    this.name="";
    this.showDragAndDrop = true;

    this.datasetSelectedEvent.emit({ isSelected: false, datasetSource: "local_upload"});
  }
  
  onLinkChange()
  {
    this.newLinkBool = true;
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
    this.fileName = this.name = datasetLink.split("/").pop()!;
  }

  onUrlInputChange(event:any) {
    console.log(event.target.value)
    if(this.datasetURL == '')
      this.datasetSelectedEvent.emit({ isSelected: false, datasetSource: "link"});
    else  
      this.datasetSelectedEvent.emit({ isSelected: true, datasetSource: "link"});
  }
}

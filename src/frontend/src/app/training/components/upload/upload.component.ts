import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';



@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file?:File;
  datasetURL:string;
  isLoggedIn:boolean;
  @Output() linkEvent: EventEmitter<string>; //podizanje event-a kada se salje link
  @Output() uploadEvent: EventEmitter<File>; //podizanje event-a kada se salje file

  constructor(private authService : AuthService) {
    this.datasetURL = "";
    this.linkEvent = new EventEmitter<string>();
    this.uploadEvent = new EventEmitter<File>();
    this.isLoggedIn = this.authService.isLoggedIn();
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
  }

  onFileDropped(file:File)
  {
    this.file = file;
  }

  uploadClick()
  {
    this.uploadEvent.emit(this.file);
  }
  
  linkClick()
  {
    this.linkEvent.emit(this.datasetURL);
  }
}

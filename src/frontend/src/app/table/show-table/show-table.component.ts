import { Component, OnInit } from '@angular/core';
import { ParsingService } from '../parsing.service';
import { Papa, ParseResult } from 'ngx-papaparse';


@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {

  header:any[] = [];
  data:any[] = [];
  constructor(private parsingService : ParsingService, private papa:Papa) { }

  ngOnInit(): void {
  }

  onFileSelected(event:Event)
  {

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    
    if (fileList) {
      var data = this.parsingService.parsingFile(fileList);;
    }
    
    
  }

}

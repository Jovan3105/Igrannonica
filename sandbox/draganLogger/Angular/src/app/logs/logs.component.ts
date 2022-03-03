import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  constructor(private service:SharedService) { }

  LogsList:any=[];
  log:any;

  ngOnInit(): void {
    this.refreshLogsList();
  }

  refreshLogsList(){
    this.service.getLogsList().subscribe(data=>
      {
        this.LogsList=data;
      })
  }
  addClick(){
    var log={
      "id":"0",
      "naziv":"test",
      "opis":"atatatt",
      "datum":""
    }
    this.service.addLog(log).subscribe(res=>
      {
        alert(res.toString());
      });
  }
}

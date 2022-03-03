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

  ngOnInit(): void {
    this.refreshLogsList();
  }

  refreshLogsList(){
    this.service.getLogsList().subscribe(data=>
      {
        this.LogsList=data;
      })
  }
}

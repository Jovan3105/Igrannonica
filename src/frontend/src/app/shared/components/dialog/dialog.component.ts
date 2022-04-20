import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @Input() title:string;
  @Input() message:string;
  constructor(@Inject(MAT_DIALOG_DATA) data : {title: string, message:string}) 
  {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}

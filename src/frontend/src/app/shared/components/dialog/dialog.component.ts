import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @Input() title:string;
  @Input() message:string;
  @Input() input:boolean;
  input_value:string = '';
  warning:string = "";

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data : {title: string, message:string, input:boolean}) 
  {
    this.title = data.title;
    this.message = data.message;
    this.input = data.input;
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  onAddClick(){
    if (this.input_value == "")
    {
      this.warning ="Please fill out the field below."
    }
    else{
      this.dialogRef.close(this.input_value);
    }
  }
}

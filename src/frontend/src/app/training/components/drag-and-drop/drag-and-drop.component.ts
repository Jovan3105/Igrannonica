import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})


export class DragAndDropComponent implements OnInit {

  constructor() { }
  layers= [
    {"units":4,"af":"ReLu"},
    {"units":7,"af":"ReLu"},
    {"units":1,"af":"ReLu"}
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
  }

  removeLayer(index:number){

    this.layers.splice(index, 1);

  }

  addLayer(){
    this.layers.push({"units":1,"af":"ReLu"});
  }

  ngOnInit(): void {
  }

}

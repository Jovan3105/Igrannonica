import { Component, OnInit, Output, EventEmitter, Input, NgIterable } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})


export class DragAndDropComponent implements OnInit {

  @Output() addLayerEvent = new EventEmitter();
  @Output() dropLayerEvent = new EventEmitter();
  @Output() removeLayerEvent = new EventEmitter();
  @Input() layers!:any[];
  @Input() activationFunctions!:any[];

  constructor() { }
  

  drop(event: CdkDragDrop<string[]>) {
    this.dropLayerEvent.emit(event);
  }

  removeLayer(index:number){
    this.removeLayerEvent.emit(index);
  }

  addLayer(){
    this.addLayerEvent.emit();
  }

  ngOnInit(): void {
  }

}

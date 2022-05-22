import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dataset-info',
  templateUrl: './dataset-info.component.html',
  styleUrls: ['./dataset-info.component.css']
})
export class DatasetInfoComponent implements OnInit {

  @Input() filenameFromParent: string | undefined  = '';
  filename?: string = "";
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filenameFromParent'] 
    && changes['filenameFromParent']?.previousValue != changes['filenameFromParent']?.currentValue) {
      if(this.filenameFromParent) {
        let text = this.filenameFromParent;
        // remove extension
        text = text.replace(/\.[^/.]+$/, '');

        // capitalize first letter
        text = text.charAt(0).toUpperCase() + text.slice(1);

        this.filename = text;
      }
    }
  }
}

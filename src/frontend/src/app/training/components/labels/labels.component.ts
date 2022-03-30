import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  state:any;

  constructor(private router: Router) {
     const navigation = this.router.getCurrentNavigation();
    
     if (navigation)
     {
       this.state = navigation.extras.state;
     }
  }

  ngOnInit(): void {

    console.log(this.state);
  }

  onBackClick(){
    this.router.navigate(['/dashboard']);
  }

}

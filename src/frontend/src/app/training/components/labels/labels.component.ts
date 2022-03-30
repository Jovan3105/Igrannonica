import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  headers:any = null;
  types:any = null;

  constructor() {
     //const navigation = this.router.getCurrentNavigation();
    
     /*
     if (navigation)
     {
       this.state = navigation.extras.state;
     }*/
  }

  ngOnInit(): void {

    //console.log(this.state);
  }

  onBackClick(){
    //this.router.navigate(['/dashboard']);
  }
  onDatasetSelected(types:any)
  {
    var tempHeader;
    this.headers = new Map<string,string>();
    this.types = types;

    this.types.forEach((element:any) => {

      tempHeader = Object.getOwnPropertyNames(element);
      if (tempHeader.length > 0) this.headers.set(tempHeader[0],element[tempHeader[0]]);
    });

    console.log(this.headers);
  }

  onCheck(id:number){
    //console.log("Doslo je do promene " + id);


  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  users!: any;
  userSelectedID: any;
  @ViewChild('email') email: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
    const getUserObserver = {
      next: (x:any) => {
        console.log('Users get');
        this.users = x;
      },
      error: (err: any) => {
       
      }
    };

    this.userService.getUsers().subscribe(getUserObserver);
    
  }
  deleteUser(id:number){
    const deleteUserObserver = {
      next: (x:any) => {
        console.log('User deleted');
        window.location.reload(); // srediti bez page reload
        this.userSelectedID = null;
      },
      error: (err: any) => {
        alert("Error");
      }
    };

    this.userService.deleteUser(id).subscribe(deleteUserObserver);
  }
  selectUser(id:number){
    this.userSelectedID = id;
  }
  deleteUserByEmail(){
    // var inputValue = (<HTMLInputElement>document.getElementById("email")).value;
    var inputValue = this.email.nativeElement.value
    console.log(inputValue)
    const deleteUserByEmailObserver = {
      next: (x:any) => {
        console.log('User deleted by email');
        window.location.reload(); // srediti bez page reload
      },
      error: (err: any) => {
       alert("Error");
      }
    };

    this.userService.deleteUserByEmail(inputValue).subscribe(deleteUserByEmailObserver);
  }

}

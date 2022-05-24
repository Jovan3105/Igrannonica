import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  users!: any;

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
      },
      error: (err: any) => {
       
      }
    };

    this.userService.deleteUser(id).subscribe(deleteUserObserver);
  }
  

}

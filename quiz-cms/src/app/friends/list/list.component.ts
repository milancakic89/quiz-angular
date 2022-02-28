import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { User } from 'src/app/shared/config.service';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private friendsService: FriendsService) { }

  public searchQuery = '';

  public friends: User[] = [];

  public searchQueryStream = new Subject<string>();

  ngOnInit(): void {
    this.searchQueryStream.pipe(debounceTime(500))
    .subscribe(query =>{
        this.load();
    })
  }

  public async load(){
    const { data, success } = await this.friendsService.searchUsers(this.searchQuery)
    if(success){
      this.friends = data;
    }
  }

  public sendFriendRequest(id: string){
    console.log(id)
  }

}


import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Configuration, User } from 'src/app/shared/config.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SocketService } from 'src/app/socket-service';
import { FriendsService } from '../friends.service';

type Tab = 'Pronadji' | 'Prijatelji' | 'Zahtevi';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  constructor(private friendsService: FriendsService, 
              private socket: SocketService,
              private notifications: NotificationService,
              private config: Configuration) { }

  public user: User = {} as User;

  public searchQuery = '';

  public selectedTab: Tab = 'Prijatelji';

  public sendingRequest = false;

  public friends: User[] = [];
  public friendRequests: User[] = [];
  public acceptedFriends: User[] = [];

  public searchQueryStream = new Subject<string>();

  public socketSubscription: Subscription = {} as Subscription;

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.config.user.subscribe(user =>{
      if(user){
        this.user = user;
      }
    });

    this.socketSubscription = this.socket.socketData.subscribe(data =>{
      if(data && data.event === 'ADD_FRIEND' && data.success){
          this.notifications.notification.emit({success: true, message: 'Zahtev uspesno poslat'})
      }
      if (data && data.event === 'ADD_FRIEND' && !data.success) {
        this.notifications.notification.emit({ success: true, message: 'Zahtev nije uspeo' })
      }
      if (data && data.event === 'ADD_FRIEND_FAILED') {
        this.notifications.notification.emit({ success: false, message: 'Zahtev nije uspeo, pokusajte ponovo' })
      }
      if(data && data.event === 'FRIEND_ALLREADY_REQUESTED'){
        this.notifications.notification.emit({ success: true, message: 'Zahtev za prijateljstvo vec postoji' })
      }
    })

    this.searchQueryStream.pipe(debounceTime(500))
    .subscribe(query =>{
      if (this.selectedTab === 'Pronadji'){
        this.load();
      }
        
    })
  }

  public async load(){
    const { data, success } = await this.friendsService.searchUsers(this.searchQuery)
    if(success){
      this.friends = data.filter(user => user._id !== this.user._id);
    }
  }

  public async getFriendRequests(){
    const { data, success } = await this.friendsService.getFriendsRequests()
    if(success){
      this.friendRequests = data;
    }
    console.log(data)
  }

  public async getFriendsList(){
    const { data, success } = await this.friendsService.getFriendsList();
    if(success){
      this.acceptedFriends = data;
    }
    console.log(data)
  }

  public sendFriendRequest(id: string){
    if(!this.sendingRequest || id === this.user._id){
      this.socket.emit('ADD_FRIEND', {user_id: this.user._id, friend_id: id})
    }
  }

  public acceptFriendRequest(id: string){
    this.socket.emit('ACCEPT_FRIEND', { user_id: this.user._id, friend_id: id })
  }


}

import { Component, inject, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, debounceTime, filter, skip, take } from 'rxjs';
import { EVENTS } from '../events';
import { NotificationService } from '../shared/notifications.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  socketService = inject(SocketService);
  notificationService = inject(NotificationService)
  private _changeName$ = new BehaviorSubject('')

  nameChange = '';
  imageUrl = '';

  changeNameTypeahead$ = this._changeName$.asObservable().pipe(
    skip(1),
    debounceTime(400)
  ).subscribe(val => {
    console.log({ val })
    this.socketService.sendMessage({
      event: EVENTS.UPDATE_SETTINGS,
      settings: {
        name: val,
        image: this.imageUrl
      }

    })
  })

  user$ = this.socketService.user$;

  ngOnInit(): void {
    this.socketService.user$.pipe(take(1)).subscribe(user => {
      this.nameChange = user.name;
      this.imageUrl = user.avatar_url
    })
    this.socketService.messages$.pipe(
      filter(socketDate => socketDate.event === EVENTS.UPDATE_SETTINGS)
    ).subscribe(_ => {
      this.notificationService.showMessage({
        type: 'SUCCESS',
        message: 'Saved'
      })
    })
  }

  onChange(){
    console.log('on change', this.nameChange)
    this._changeName$.next(this.nameChange)
  }

}

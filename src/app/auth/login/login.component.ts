import { ChangeDetectionStrategy, Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { SocketEvent, SocketService } from '../../socket.service'
import {BehaviorSubject, Observable, Subscription } from 'rxjs';
import {filter, map, take, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { EVENTS } from '../../events';
import { NotificationService } from '../../shared/notifications.service';
import { Router, RouterModule } from '@angular/router';
import { OverlayLoaderComponent } from "../../shared/components/overlay-loader/overlay-loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule, RouterModule, OverlayLoaderComponent, OverlayLoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy{

  notificationService = inject(NotificationService)

  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _socketService = inject(SocketService);
  private _loading$ = new BehaviorSubject(false);

  loading$ = this._loading$.asObservable();

  loginSubscription: Subscription;
  activateSubscription: Subscription;

  signinForm = this._fb.group({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
    password: new FormControl('', [Validators.required, passwordValidator()])
  });

  constructor(){
     this._socketService.connect()
  }

  ngOnInit(): void {
    this.loginSubscription = this._socketService.messages$.pipe(
      filter(socketData => socketData.event === EVENTS.LOGIN),
    ).subscribe(
      _ => this._loading$.next(false)
    );

    this.activateSubscription = this._socketService.messages$.pipe(
      filter(socketData => socketData.event === EVENTS.ACCOUNT_NOT_ACTIVATED),
      map(data => data.data)
    ).subscribe(
      activated => {
        if(!activated){
          this._socketService.activateRouteAllow = true;
          this._loading$.next(false);
          setTimeout(() => {
            this._router.navigateByUrl('activate')
          })
        }

       
      }
    )
  }

  ngOnDestroy(): void {
    this._loading$.next(false);
      this.loginSubscription.unsubscribe()
  }


  onSubmit(): void {
   this._loading$.next(true);
   const { email, password } = this.signinForm.value;
   this._socketService.tempEmail = email;

    this._socketService.sendMessage({
        event: EVENTS.LOGIN,
        email: email,
        password: password
    })


  }

}

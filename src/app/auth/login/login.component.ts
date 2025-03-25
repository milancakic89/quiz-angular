import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { SocketEvent, SocketService } from '../../socket.service'
import {Observable } from 'rxjs';
import {filter, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { EVENTS } from '../../events';
import { NotificationService } from '../../shared/notifications.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent{

  notificationService = inject(NotificationService)

  private _fb = inject(FormBuilder);
  private _socketService = inject(SocketService);

  loginSuccess$ =  this._socketService.messages$.pipe(
    filter(socketEvent => socketEvent.event === EVENTS.LOGIN))
    .subscribe(_ => {
      this.notificationService.handleEventMessage(EVENTS.LOGIN, 'SUCCESS')
    });

  incorectLogin$ = this._socketService.messages$.pipe(
    filter(socketEvent => socketEvent.event === EVENTS.INCORRECT_LOGIN_DETAILS))
    .subscribe(_ => {
      this.notificationService.handleEventMessage(EVENTS.INCORRECT_LOGIN_DETAILS, 'ERROR')
    });


  signinForm = this._fb.group({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
    password: new FormControl('', [Validators.required, passwordValidator()])
  });


  onSubmit(): void {
   const { email, password } = this.signinForm.value;

    this._socketService.sendMessage({
        event: 'LOGIN',
        email: email,
        password: password
    })
  }

}

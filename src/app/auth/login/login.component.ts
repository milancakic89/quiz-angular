import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { SocketEvent, SocketService } from '../../socket.service'
import {Observable } from 'rxjs';
import {filter, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { EVENTS } from '../../events';
import { NotificationService } from '../../shared/notifications.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent{

  notificationService = inject(NotificationService)

  private _fb = inject(FormBuilder);
  private _socketService = inject(SocketService);

  signinForm = this._fb.group({
    email: new FormControl('test@test.com', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
    password: new FormControl('Masterdamus12', [Validators.required, passwordValidator()])
  });


  onSubmit(): void {
   const { email, password } = this.signinForm.value;

    this._socketService.sendMessage({
        event: EVENTS.LOGIN,
        email: email,
        password: password
    })
  }

}

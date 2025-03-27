
import { Component, inject} from '@angular/core';
import { SocketService } from '../../socket.service'
import { filter, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { EVENTS } from '../../events';
import { NotificationService } from '../../shared/notifications.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  submitted = false;

  notificationService = inject(NotificationService)
  router = inject(Router)

  private _fb = inject(FormBuilder);
  private _socketService = inject(SocketService);

  registerSuccess$ =  this._socketService.messages$.pipe(
    tap(_ => this.submitted = false),
    filter(socketEvent => socketEvent.event === EVENTS.REGISTER))
    .subscribe(_ => {
      this.router.navigateByUrl('');
    });


  signupForm = this._fb.group({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    repeatPassword: new FormControl('', [Validators.required, passwordValidator()])
  });



  onSubmit(): void {
   this.submitted = true;
   const { email, password, repeatPassword } = this.signupForm.value;
   if(repeatPassword !== password){
      return;
   }
    this._socketService.sendMessage({
        event: EVENTS.REGISTER,
        email: email,
        password: password
    })
  }

}

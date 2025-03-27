import { CanActivateFn, Router } from '@angular/router';
import { SocketService } from '../../socket.service';
import { inject } from '@angular/core';
import { filter } from 'rxjs';
import { EVENTS } from '../../events';

export const AuthenticatedGuard: CanActivateFn = () => {
  const socketService = inject(SocketService);
  const router = inject(Router)
  let canActivate = true;

  socketService.user$.subscribe(user => {
    if(user){
        canActivate = false;
        socketService.sendMessage({
          event: EVENTS.SAVE_SOCKET,
          user_id: user._id
        })
        router.navigateByUrl('/dashboard');
    }
  })
 
  return canActivate;
};

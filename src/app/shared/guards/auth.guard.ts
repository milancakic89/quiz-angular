import { CanActivateFn, Router } from '@angular/router';
import { SocketService } from '../../socket.service';
import { inject } from '@angular/core';
import { filter } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const socketService = inject(SocketService);
  const router = inject(Router)
  let canActivate = false;

  socketService.user$.subscribe(user => {
    if(user){
      canActivate = true;
    }else{
      canActivate = false;
      router.navigateByUrl('');
    }
 
  });
  if(!canActivate){
    router.navigateByUrl('');
  }
  return canActivate;
};

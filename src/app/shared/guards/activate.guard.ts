import { CanActivateFn, Router } from '@angular/router';
import { SocketService } from '../../socket.service';
import { inject } from '@angular/core';
import { filter } from 'rxjs';

export const ActivateGuard: CanActivateFn = () => {
  const socketService = inject(SocketService);
  return socketService.activateRouteAllow;
};

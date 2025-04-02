import { CanDeactivateFn } from '@angular/router';

export const playingGuard: CanDeactivateFn<unknown> = (component: any, currentRoute, currentState, nextState) => {
  return !component.canDeactivate() ? confirm('You are about to leave the tournament. Are you sure?') : true;
};

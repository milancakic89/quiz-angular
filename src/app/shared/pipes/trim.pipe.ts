import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value.length < 130){
      return value;
    }
    return value.slice(0, 130) + '...';
  }

}

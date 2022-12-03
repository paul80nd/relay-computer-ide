import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dec' })
export class DecPipe implements PipeTransform {
  transform(value: number, length: string): string {
    const len = parseInt(length);
    if (!value) { value = 0; }
    return `${value}`;
  }
}

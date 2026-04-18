import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileUrl',
  standalone: true
})
export class FileUrlPipe implements PipeTransform {
  transform(file: File | null): string | null {
    if (!file) return null;
    return URL.createObjectURL(file);
  }
}

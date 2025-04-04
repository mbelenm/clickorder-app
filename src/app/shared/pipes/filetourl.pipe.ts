/*import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filetourl',
  standalone: false,
})
export class FiletourlPipe implements PipeTransform {

  transform(file: File | any): string {
    if (typeof file == 'string') {
      if (file.search('http') == 0) {
        return file;
      }
    }
    return URL.createObjectURL(file);
  }

}
*/


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filetourl',
  standalone: false,
})
export class FiletourlPipe implements PipeTransform {

  transform(file: File | any): string | null {
    // Verifica si 'file' es una URL (cadena de texto)
    if (typeof file === 'string') {
      // Si la cadena comienza con 'http', entonces es una URL y no necesita ser transformada
      if (file.startsWith('http')) {
        return file;
      } else {
        // Si es una ruta local, puedes intentar manejarlo de manera diferente
        console.warn('Ruta local o archivo no válido:', file);
        return file; // O podrías devolver un valor predeterminado si es necesario
      }
    }

    // Asegúrate de que 'file' sea un archivo o blob
    if (file instanceof File || file instanceof Blob) {
      return URL.createObjectURL(file);
    }

    // Si no es un archivo válido, devuelve null o algún valor predeterminado
    console.error('El valor no es un archivo válido:', file);
    return null;
  }
}

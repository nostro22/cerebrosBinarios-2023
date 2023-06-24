import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diferenciaMinutos'
})
export class DiferenciaMinutosPipe implements PipeTransform {

  transform(comienzo: Date | number, tiempoPreparacion: number): number {

    const horaFinal = new Date((new Date(comienzo instanceof Date ? comienzo : comienzo * 1000)).getTime() + tiempoPreparacion * 60000)
    const ahora = new Date()
    const diffMs = (horaFinal.getTime() - ahora.getTime()); 
    const diffMins = Math.round(diffMs / 60000); 
    return diffMins;
  }

}
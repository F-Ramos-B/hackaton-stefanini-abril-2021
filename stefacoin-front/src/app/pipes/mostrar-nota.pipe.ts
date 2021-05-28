import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mostrarNota'
})
export class MostrarNotaPipe implements PipeTransform {

  transform(nota: number): string {
    return nota ? `Você já deu nota ${nota} para este curso.` : 'Você não avaliou esse curso ainda.';
  }

}

import { Component, Input } from '@angular/core';

import { Curso } from './../../../models/curso';

@Component({
  selector: 'app-listar-cursos-usuario',
  templateUrl: './listar-cursos-usuario.component.html',
  styleUrls: ['./listar-cursos-usuario.component.scss']
})
export class ListarCursosUsuarioComponent {

  @Input() cursos: Curso[] = [];
  @Input() mostrarProfessor: boolean = true;
  cursoSelecionado: Curso;

  verAulas(curso: Curso) {
    this.cursoSelecionado = curso;
  }

  esconderAulas() {
    this.cursoSelecionado = null;
  }

}

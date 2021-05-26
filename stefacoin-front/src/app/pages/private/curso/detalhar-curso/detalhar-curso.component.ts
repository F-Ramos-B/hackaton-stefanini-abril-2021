import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivateBaseComponent } from 'src/app/components/shared/private-base.component';
import { Curso } from 'src/app/models/curso';

import { UsuarioToken } from './../../../../models/usuario-token';
import { AuthService } from './../../../../services/auth.service';
import { CursoService } from './../../../../services/curso.service';

@Component({
  selector: 'app-detalhar-curso',
  templateUrl: './detalhar-curso.component.html',
  styleUrls: ['./detalhar-curso.component.scss']
})
export class DetalharCursoComponent extends PrivateBaseComponent implements OnInit {

  idCurso: number;
  curso: Curso;
  usuario: UsuarioToken;
  isProfessor: boolean;

  constructor(
    protected injector: Injector,
    private cursoService: CursoService
  ) {
    super(injector.get(AuthService), injector.get(Router));
    this.idCurso = this.navigationParams?.id;
  }

  ngOnInit(): void {
    this.cursoService.buscarPorId(this.idCurso).subscribe(curso => this.curso = curso);
  }

  avaliar() {

  }

  matricular() {

  }

  desvincular() {

  }

  editar() {

  }

  excluir() {

  }

}

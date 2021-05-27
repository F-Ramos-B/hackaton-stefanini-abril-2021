import { tap } from 'rxjs/operators';
import { AlunoService } from './../../../../services/aluno.service';
import { Aluno } from './../../../../models/aluno';
import { Aula } from './../../../../models/aula';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PrivateBaseComponent } from 'src/app/components/shared/private-base.component';
import { Curso } from 'src/app/models/curso';

import { UsuarioToken } from './../../../../models/usuario-token';
import { AuthService } from './../../../../services/auth.service';
import { CursoService } from './../../../../services/curso.service';
import Mensagem from 'src/app/models/mensagem';

@Component({
  selector: 'app-detalhar-curso',
  templateUrl: './detalhar-curso.component.html',
  styleUrls: ['./detalhar-curso.component.scss']
})
export class DetalharCursoComponent extends PrivateBaseComponent implements OnInit {

  idCurso: number;
  curso$: Observable<Curso>;
  aluno$: Observable<Aluno>;
  usuario: UsuarioToken;
  isProfessor: boolean;
  isMatriculado: boolean;

  constructor(
    protected injector: Injector,
    private cursoService: CursoService,
    private alunoService: AlunoService
  ) {
    super(injector.get(AuthService), injector.get(Router));
    this.idCurso = this.navigationParams?.id;
  }

  ngOnInit(): void {
    this.buscarCurso();
    if (!this.isProfessor) {
      this.buscarAluno();
    }
  }

  buscarAluno() {
    this.aluno$ = this.alunoService.buscarPorId(this.usuario.id).pipe(
      tap(aluno => this.isMatriculado = aluno.cursos.some(curso => curso.id === this.idCurso))
    );
  }

  buscarCurso() {
    this.curso$ = this.cursoService.buscarPorId(this.idCurso);
  }

  detalharAula(aula: Aula) {
    console.log(aula);
  }

  avaliar() {

  }

  matricular() {
    this.alunoService.matricular(this.idCurso).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  desmatricular() {
    this.alunoService.desmatricular(this.idCurso).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  editar() {

  }

  excluir() {

  }

  confirmarOperacao(resposta: Mensagem): void {
    this.toastSucesso(resposta.mensagem);
    this.buscarAluno();
  }

  onAulaExcluida() {
    this.buscarCurso();
  }

}

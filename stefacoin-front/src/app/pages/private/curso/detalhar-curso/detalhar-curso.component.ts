import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { identity, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrivateBaseComponent } from 'src/app/components/shared/private-base.component';
import { Curso } from 'src/app/models/curso';
import Mensagem from 'src/app/models/mensagem';

import { Aluno } from './../../../../models/aluno';
import { Aula } from './../../../../models/aula';
import { AlunoService } from './../../../../services/aluno.service';
import { AuthService } from './../../../../services/auth.service';
import { CursoService } from './../../../../services/curso.service';

@Component({
  selector: 'app-detalhar-curso',
  templateUrl: './detalhar-curso.component.html',
  styleUrls: ['./detalhar-curso.component.scss']
})
export class DetalharCursoComponent extends PrivateBaseComponent implements OnInit {

  idCurso: number;
  curso$: Observable<Curso>;
  aluno$: Observable<Aluno>;
  isMatriculado: boolean;
  nota: number;

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
  }

  buscarCurso() {
    this.curso$ = this.cursoService.buscarPorId(this.idCurso).pipe(
                      tap(this.isProfessor ? identity : curso => {
                        this.nota = curso.avaliacoes.find(avaliacao => avaliacao.idAluno === this.usuario.id)?.nota;
                        this.buscarAluno();
                      })
                    );
  }

  buscarAluno() {
    this.aluno$ = this.alunoService.buscarPorId(this.usuario.id).pipe(
                    tap(aluno => this.isMatriculado = aluno.cursos.some(curso => curso.id === this.idCurso))
                  );
  }

  avaliar(nota: number) {
    this.cursoService.avaliar(this.idCurso, nota)
      .subscribe(resposta => this.toastSucesso(resposta.mensagem));
  }

  matricular() {
    this.alunoService.matricular(this.idCurso)
      .subscribe(resposta => this.confirmarOperacao(resposta));
  }

  desmatricular() {
    this.alunoService.desmatricular(this.idCurso)
      .subscribe(resposta => this.confirmarOperacao(resposta));
  }

  confirmarOperacao(resposta: Mensagem): void {
    this.toastSucesso(resposta.mensagem);
    this.buscarAluno();
  }

  onAulaExcluida() {
    this.buscarCurso();
  }

}

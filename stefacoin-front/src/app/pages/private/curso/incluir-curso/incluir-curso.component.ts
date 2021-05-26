import { Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { identity, Observable } from 'rxjs';
import { map, mergeAll, tap, toArray } from 'rxjs/operators';
import { PrivateBaseComponent } from 'src/app/components/shared/private-base.component';
import { Curso } from 'src/app/models/curso';
import mensagem from 'src/app/models/mensagem';
import { Professor } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';
import { FormUtils } from 'src/app/utils/form-utils';

import { AuthService } from './../../../../services/auth.service';
import { CursoService } from './../../../../services/curso.service';

@Component({
  selector: 'app-incluir-curso',
  templateUrl: './incluir-curso.component.html',
  styleUrls: ['./incluir-curso.component.scss']
})
export class IncluirCursoComponent extends PrivateBaseComponent implements OnInit {

  idEdicao: number;
  professores$: Observable<SelectItem<number>[]>;

  cursoForm: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    descricao: new FormControl(null, Validators.required),
    idProfessor: new FormControl(null, Validators.required),
    aulas: new FormArray([this.templateFormAula()], Validators.required)
  });

  constructor(
    protected injector: Injector,
    private professorService: ProfessorService,
    private cursoService: CursoService
  ) {
    super(injector.get(AuthService), injector.get(Router));
    this.idEdicao = this.navigationParams?.id;
  }

  ngOnInit(): void {
    this.carregarProfessores();
  }

  validate() {
    const action = this.idEdicao ? this.editar.bind(this) : this.cadastrar.bind(this);
    FormUtils.forceValidateAllFormFields(this.cursoForm, action);
  }

  cadastrar() {
    this.cursoService.incluir(this.cursoForm.value).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  editar() {
    this.cursoService.editar(this.idEdicao, this.cursoForm.value).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  confirmarOperacao(resposta: mensagem) {
    this.toastSucesso(resposta.mensagem);
    this.voltar();
  }

  carregarProfessores() {
    this.professores$ = this.professorService.listar().pipe(
      // mergeMap(profs => profs.map(Professor.asSelectItem)),
      mergeAll(),
      map(Professor.asSelectItem),
      toArray(),
      tap(this.idEdicao ? () => this.verificarEdicao() : identity)
    );
  }

  verificarEdicao() {
    this.aulas.clear();

    this.cursoService.buscarPorId(this.idEdicao).pipe(
      tap(curso => curso.idProfessor = curso.professor.id)
    ).subscribe(curso => this.preencherFormularioEdicao(curso));
  }

  preencherFormularioEdicao(curso: Curso) {
    curso.aulas.forEach(aula => this.aulas.push(this.templateFormAula(aula.topicos.length)));
    this.cursoForm.patchValue(curso);
  }

  voltar() {
    this.router.navigate(['cursos']);
  }

  gerarAula() {
    this.aulas.push(this.templateFormAula());
  }

  gerarTopico(indexAula: number) {
    this.getTopicosDeIndiceAula(indexAula).push(this.templateFormTopico());
  }

  removerAula(indexAula: number) {
    this.aulas.removeAt(indexAula);
  }

  removerTopico(indexAula: number, indexTopico: number) {
    this.getTopicosDeIndiceAula(indexAula).removeAt(indexTopico);
  }

  templateFormAula(numTopicos: number = 1) {
    return new FormGroup({
      id: new FormControl(null),
      idCurso: new FormControl(null),
      nome: new FormControl(null, Validators.required),
      duracao: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(25)]),
      topicos: new FormArray(Array.from({ length: numTopicos }, this.templateFormTopico), Validators.required)
    });
  }

  templateFormTopico() {
    return new FormControl(null, Validators.required);
  }

  get idProfessor(): FormControl {
    return this.cursoForm.get('idProfessor') as FormControl;
  }

  get aulas(): FormArray {
    return this.cursoForm.get('aulas') as FormArray;
  }

  getTopicosDeIndiceAula(indexAula: number): FormArray {
    return (this.aulas.at(indexAula).get('topicos') as FormArray);
  }

  getTopicosDeAulaControl(aulaControl: AbstractControl): FormArray {
    return (aulaControl.get('topicos') as FormArray);
  }

}

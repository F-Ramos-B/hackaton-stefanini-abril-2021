import { Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { identity, Observable } from 'rxjs';
import { map, mergeAll, tap, toArray } from 'rxjs/operators';
import { InclusaoBaseComponent } from 'src/app/components/shared/inclusao-base.component';
import { Curso } from 'src/app/models/curso';
import { Professor } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';
import { FormUtils } from 'src/app/utils/form-utils';

import { CursoService } from './../../../../services/curso.service';
import { UniqueFieldFormArrayValidator } from './../../../../validators/unique-field-formarray.validator';

@Component({
  selector: 'app-incluir-curso',
  templateUrl: './incluir-curso.component.html',
  styleUrls: ['./incluir-curso.component.scss']
})
export class IncluirCursoComponent extends InclusaoBaseComponent implements OnInit {

  professores$: Observable<SelectItem<number>[]>;

  formulario: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    descricao: new FormControl(null, Validators.required),
    idProfessor: new FormControl(null, Validators.required),
    aulas: new FormArray([this.templateFormAula()], [Validators.required, UniqueFieldFormArrayValidator.validarUnique('nome')])
  });

  constructor(
    protected injector: Injector,
    private professorService: ProfessorService,
    private cursoService: CursoService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.carregarProfessores();
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

  validate() {
    FormUtils.forceValidateForm(this.formulario, null, false);
    const erros = FormUtils.achatarErros(this.formulario);

    if (erros) {
      this.toastAviso('unique' in erros ? 'Existem aulas com nomes repetidos ou tópicos na mesma aula com nomes repetidos.' : 'Preencha os campos obrigatórios.');
    } else {
      this.idEdicao ? this.editar() : this.cadastrar();
    }
  }

  cadastrar() {
    this.cursoService.incluir(this.formulario.value).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  editar() {
    this.cursoService.editar(this.idEdicao, this.formulario.value).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  verificarEdicao() {
    this.aulas.clear();

    this.cursoService.buscarPorId(this.idEdicao).pipe(
      tap(curso => curso.idProfessor = curso.professor.id)
    ).subscribe(curso => this.preencherFormularioEdicao(curso));
  }

  preencherFormularioEdicao(curso: Curso) {
    curso.aulas.forEach(aula => this.aulas.push(this.templateFormAula(aula.topicos.length)));
    this.formulario.patchValue(curso);
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
      topicos: new FormArray(Array.from({ length: numTopicos }, this.templateFormTopico), [Validators.required, UniqueFieldFormArrayValidator.validarUnique()])
    });
  }

  templateFormTopico() {
    return new FormControl(null, Validators.required);
  }

  get idProfessor(): FormControl {
    return this.formulario.get('idProfessor') as FormControl;
  }

  get aulas(): FormArray {
    return this.formulario.get('aulas') as FormArray;
  }

  getTopicosDeIndiceAula(indexAula: number): FormArray {
    return (this.aulas.at(indexAula).get('topicos') as FormArray);
  }

  getTopicosDeAulaControl(aulaControl: AbstractControl): FormArray {
    return (aulaControl.get('topicos') as FormArray);
  }

}

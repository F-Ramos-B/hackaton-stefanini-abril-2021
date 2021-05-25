import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map, mergeAll, toArray } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/shared/base.component';
import mensagem from 'src/app/models/mensagem';
import { Professor } from 'src/app/models/professor';
import { ProfessorService } from 'src/app/services/professor.service';
import { FormUtils } from 'src/app/utils/form-utils';

import { CursoService } from './../../../../services/curso.service';


@Component({
  selector: 'app-incluir-curso',
  templateUrl: './incluir-curso.component.html',
  styleUrls: ['./incluir-curso.component.scss']
})
export class IncluirCursoComponent extends BaseComponent implements OnInit {

  idEdicao: number;
  professores$: Observable<SelectItem<number>[]>;

  cursoForm: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    descricao: new FormControl(null, Validators.required),
    idProfessor: new FormControl(null, Validators.required),
    aulas: new FormArray([this.addAula()], Validators.required)
  });

  constructor(
    private professorService: ProfessorService,
    private cursoService: CursoService,
    private router: Router
  ) {
    super();
    const extras = this.router.getCurrentNavigation()?.extras?.state;
    if (extras) {
      this.idEdicao = extras.id;
    }
  }

  ngOnInit(): void {
    this.carregarProfessores();
  }

  validate() {
    FormUtils.forceValidateAllFormFields(this.cursoForm, this.cadastrar.bind(this));
  }

  cadastrar() {
    console.log(this.cursoForm.value);
  }

  confirmarOperacao(resposta: mensagem) {
    this.toastSucesso(resposta.mensagem);
    this.voltar();
  }

  carregarProfessores() {
    this.professores$ = this.professorService.listar().pipe(
      mergeAll(),
      map(Professor.asSelectItem),
      toArray()
    );
  }

  voltar() {
    this.router.navigate(['login']);
  }

  getTopicos(control: AbstractControl): AbstractControl[] {
    return (control.get('topicos') as FormArray).controls;
  }

  addAula() {
    return new FormGroup({
      nome: new FormControl(null, Validators.required),
      descricao: new FormControl(null, Validators.required),
      duracao: new FormControl(null, Validators.required),
      topicos: new FormArray([this.addTopico()], Validators.required)
    });
  }

  addTopico() {
    return new FormGroup({
      nome: new FormControl(null, Validators.required)
    });
  }

  removerAula(index: number) {
    this.aulas.removeAt(index);
  }

  removerTopico(indexAula: number, indexTopico: number) {
    const topicos = this.aulas.at(indexAula).get('topicos') as FormArray;
    topicos.removeAt(indexTopico);
  }

  newAula() {
    this.aulas.push(this.addAula());
  }

  newTopico(index: number) {
    (this.aulas.get([index, 'topicos']) as FormArray).push(this.addTopico());
  }

  get idProfessor(): FormControl {
    return this.cursoForm.get('idProfessor') as FormControl;
  }

  get aulas(): FormArray {
    return this.cursoForm.get('aulas') as FormArray;
  }

}

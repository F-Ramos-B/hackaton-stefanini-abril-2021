import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import mensagem from 'src/app/models/mensagem';

import { EnumTipoUsuario } from '../../../enums/enum-tipo-usuario.model';
import { BaseComponent } from './../../../components/shared/base.component';
import { AlunoService } from './../../../services/aluno.service';
import { CadastroService } from './../../../services/cadastro.service';
import { ProfessorService } from './../../../services/professor.service';
import { UsuarioService } from './../../../services/usuario.service';
import { FormUtils } from './../../../utils/form-utils';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent extends BaseComponent implements OnInit {

  idEdicao: number;
  idTipoFixo: number;
  tipos: SelectItem<number>[] = EnumTipoUsuario.asSelectItem();
  isProfessor: boolean = true;

  cadastroForm: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    senha: new FormControl(null, Validators.required),
    tipo: new FormControl(EnumTipoUsuario.PROFESSOR.id, Validators.required),
    idade: new FormControl({ value: null, disabled: true }),
    formacao: new FormControl({ value: null, disabled: true })
  });

  constructor(
    private cadastroService: CadastroService,
    private professorService: ProfessorService,
    private alunoService: AlunoService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    super();
    const extras = this.router.getCurrentNavigation()?.extras?.state;
    if (extras) {
      this.idEdicao = extras.id;
      this.idTipoFixo = extras.tipo;
    }
  }

  ngOnInit(): void {
    this.observarMudancaTipo();
  }

  validate() {
    FormUtils.forceValidateAllFormFields(this.cadastroForm, this.cadastrar.bind(this));
  }

  cadastrar() {
    if (this.idEdicao) {
      const isProfessor = EnumTipoUsuario.is.PROFESSOR(this.idTipoFixo);
      const service = isProfessor ? this.professorService : this.alunoService;

      service.editar(this.idEdicao, this.cadastroForm.value).subscribe(resposta => this.confirmarOperacao(resposta));
    } else {
      this.cadastroService.cadastrar(this.cadastroForm.value).subscribe(resposta => this.confirmarOperacao(resposta));
    }
  }

  private confirmarOperacao(resposta: mensagem) {
    this.toastSucesso(resposta.mensagem);
    this.voltar();
  }

  observarMudancaTipo() {
    this.tipo.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(valor => {
      this.isProfessor = EnumTipoUsuario.is.PROFESSOR(valor);

      if (this.isProfessor) {
        FormUtils.retiraObrigatoriedadeDesabilitaEresetaControl(this.idade);
        FormUtils.retiraObrigatoriedadeDesabilitaEresetaControl(this.formacao);
      } else {
        FormUtils.tornarControlObrigatorioEhabilitadoComValidators(this.idade, [Validators.required, Validators.min(18), Validators.max(65)]);
        FormUtils.tornarControlObrigatorioEhabilitado(this.formacao);
      }
    });

    if (this.idTipoFixo) {
      this.tipo.setValue(this.idTipoFixo);
    }

    if (this.idEdicao) {
      this.email.disable();
      this.carregarUsuario();
    }
  }

  carregarUsuario() {
    this.usuarioService.obterPorId(this.idEdicao).subscribe(usuario => this.cadastroForm.patchValue(usuario));
  }

  voltar() {
    if (this.idTipoFixo) {
      const rota = EnumTipoUsuario.is.PROFESSOR(this.idTipoFixo) ? 'professores' : 'alunos';
      this.router.navigate([rota]);
    } else {
      this.router.navigate(['login']);
    }
  }

  get idade(): FormControl {
    return this.cadastroForm.get('idade') as FormControl;
  }

  get formacao(): FormControl {
    return this.cadastroForm.get('formacao') as FormControl;
  }

  get email(): FormControl {
    return this.cadastroForm.get('email') as FormControl;
  }

  get tipo(): FormControl {
    return this.cadastroForm.get('tipo') as FormControl;
  }

}

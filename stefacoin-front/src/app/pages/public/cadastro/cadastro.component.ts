import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { InclusaoBaseComponent } from 'src/app/components/shared/inclusao-base.component';

import { EnumTipoUsuario } from '../../../enums/enum-tipo-usuario.model';
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
export class CadastroComponent extends InclusaoBaseComponent implements OnInit {

  idTipoFixo: number;
  tipos: SelectItem<number>[] = EnumTipoUsuario.asSelectItem();
  isProfessor: boolean = true;

  formulario: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    senha: new FormControl(null, Validators.required),
    tipo: new FormControl(EnumTipoUsuario.PROFESSOR.id, Validators.required),
    idade: new FormControl({ value: null, disabled: true }),
    formacao: new FormControl({ value: null, disabled: true })
  });

  constructor(
    protected injector: Injector,
    private cadastroService: CadastroService,
    private professorService: ProfessorService,
    private alunoService: AlunoService,
    private usuarioService: UsuarioService
  ) {
    super(injector);
    this.idTipoFixo = this.navigationParams?.tipo;
  }

  ngOnInit(): void {
    this.observarMudancaTipo();
  }

  validate() {
    const operacao = this.idEdicao ? this.editar.bind(this) : this.cadastrar.bind(this);
    FormUtils.forceValidateForm(this.formulario, operacao);
  }

  cadastrar() {
    this.cadastroService.cadastrar(this.formulario.value).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  editar() {
    const isEdicaoProfessor = EnumTipoUsuario.is.PROFESSOR(this.idTipoFixo);
    const service = isEdicaoProfessor ? this.professorService : this.alunoService;

    service.editar(this.idEdicao, this.formulario.value).subscribe(resposta => this.confirmarOperacao(resposta));
  }

  observarMudancaTipo() {
    this.tipo.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(valor => {
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
    this.usuarioService.obterPorId(this.idEdicao).subscribe(usuario => this.formulario.patchValue(usuario));
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
    return this.formulario.get('idade') as FormControl;
  }

  get formacao(): FormControl {
    return this.formulario.get('formacao') as FormControl;
  }

  get email(): FormControl {
    return this.formulario.get('email') as FormControl;
  }

  get tipo(): FormControl {
    return this.formulario.get('tipo') as FormControl;
  }

}

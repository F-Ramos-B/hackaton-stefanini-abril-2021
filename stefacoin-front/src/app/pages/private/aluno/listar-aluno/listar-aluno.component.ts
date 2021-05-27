import { Component, Injector, OnInit } from '@angular/core';
import { CrudBaseComponent } from 'src/app/components/shared/crud-base.component';
import { EnumTipoUsuario } from 'src/app/enums/enum-tipo-usuario.model';
import { Aluno } from 'src/app/models/aluno';

import { AlunoService } from './../../../../services/aluno.service';

@Component({
  selector: 'app-listar-aluno',
  templateUrl: './listar-aluno.component.html',
  styleUrls: ['./listar-aluno.component.scss']
})
export class ListarAlunoComponent extends CrudBaseComponent<Aluno> implements OnInit {

  constructor(
    protected injector: Injector,
    private alunoService: AlunoService
  ) { super(injector); }

  listar() {
    this.dadosTabela$ = this.alunoService.listar();
  }

  editar(id: number) {
    this.router.navigate(['alunos', 'editar'], { state: { id, tipo: EnumTipoUsuario.ALUNO.id } });
  }

  excluir(aluno: Aluno) {
    this.confirmService.confirm({
      message: `Tem certeza que deseja excluir o aluno ${aluno.nome}?`,
      accept: () => this.confirmExcluir(aluno.id),
      acceptLabel: 'Sim',
      rejectLabel: 'Não'
    });
  }

  confirmExcluir(id: number) {
    this.alunoService.excluir(id).subscribe(resposta => {
      this.toastSucesso(resposta.mensagem);
      this.listar();
    });
  }

}

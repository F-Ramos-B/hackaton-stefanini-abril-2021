import { Curso } from './../../../../models/curso';
import { Component, Injector } from '@angular/core';
import { CrudBaseComponent } from 'src/app/components/shared/crud-base.component';

import { EnumTipoUsuario } from '../../../../enums/enum-tipo-usuario.model';
import { Professor } from './../../../../models/professor';
import { ProfessorService } from './../../../../services/professor.service';

@Component({
  selector: 'app-listar-professor',
  templateUrl: './listar-professor.component.html',
  styleUrls: ['./listar-professor.component.scss']
})
export class ListarProfessorComponent extends CrudBaseComponent<Professor> {

  constructor(
    protected injector: Injector,
    private professorService: ProfessorService
  ) { super(injector); }

  listar() {
    this.dadosTabela$ = this.professorService.listar();
  }

  editar(id: number) {
    this.router.navigate(['professores', 'editar'], { state: { id, tipo: EnumTipoUsuario.PROFESSOR.id } });
  }

  excluir(professor: Professor) {
    this.confirmService.confirm({
      message: `Tem certeza que deseja excluir o professor ${professor.nome}?`,
      accept: () => this.confirmExcluir(professor.id),
      acceptLabel: 'Sim',
      rejectLabel: 'Não'
    });
  }

  confirmExcluir(id: number) {
    this.professorService.excluir(id).subscribe(resposta => {
      this.toastSucesso(resposta.mensagem);
      this.listar();
    });
  }

  verCursos(cursos: Curso[]) {
    console.log(cursos);
  }

}

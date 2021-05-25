import { Component, Injector, OnInit } from '@angular/core';
import { CrudBaseComponent } from 'src/app/components/shared/crud-base.component';

import { Curso } from './../../../../models/curso';
import { CursoService } from './../../../../services/curso.service';

@Component({
  selector: 'app-listar-curso',
  templateUrl: './listar-curso.component.html',
  styleUrls: ['./listar-curso.component.scss']
})
export class ListarCursoComponent extends CrudBaseComponent<Curso> implements OnInit {

  constructor(
    protected injector: Injector,
    private cursoService: CursoService,
  ) { super(injector); }

  listar() {
    this.dadosTabela$ = this.cursoService.listar();
  }

  editar(id: number) {
    this.router.navigate(['cursos', 'editar'], { state: { id } });
  }

  detalhar(id: number) {
    this.router.navigate(['cursos', 'detalhar'], { state: { id } });
  }

  excluir(curso: Curso) {
    this.confirmService.confirm({
      message: `Tem certeza que deseja excluir o curso ${curso.nome}?`,
      accept: () => this.confirmExcluir(curso.id),
      acceptLabel: 'Sim',
      rejectLabel: 'Não'
    });
  }

  confirmExcluir(id: number) {
    this.cursoService.excluir(id).subscribe(resposta => {
      this.toastSucesso(resposta.mensagem);
      this.listar();
    });
  }
}

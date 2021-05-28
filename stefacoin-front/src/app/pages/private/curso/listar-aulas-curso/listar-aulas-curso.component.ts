import { ConfirmationService } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/components/shared/base.component';

import { Aula } from './../../../../models/aula';
import { Curso } from './../../../../models/curso';
import { AulaService } from './../../../../services/aula.service';

@Component({
  selector: 'app-listar-aulas-curso',
  templateUrl: './listar-aulas-curso.component.html',
  styleUrls: ['./listar-aulas-curso.component.scss']
})
export class ListarAulasCursoComponent extends BaseComponent {

  @Input() mostrarAcoes: boolean;
  @Input() curso: Curso;
  @Output() onAulaExcluida: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router,
    private confirmService: ConfirmationService,
    private aulaService: AulaService
  ) { super(); }

  editar(id: number) {
    this.router.navigate(['cursos', 'editar'], { state: { id } });
  }

  excluir(aula: Aula) {
    this.confirmService.confirm({
      message: `Tem certeza que deseja excluir a aula ${aula.nome}?`,
      accept: () => this.confirmExcluir(aula.id),
      acceptLabel: 'Sim',
      rejectLabel: 'Não'
    });
  }

  confirmExcluir(id: number) {
    this.aulaService.excluir(id, this.curso.id).subscribe(resposta => {
      this.toastSucesso(resposta.mensagem);
      this.onAulaExcluida.emit();
    });
  }

}

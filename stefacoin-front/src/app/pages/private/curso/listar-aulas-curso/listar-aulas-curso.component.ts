import { Aula } from './../../../../models/aula';
import { BaseComponent } from 'src/app/components/shared/base.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar-aulas-curso',
  templateUrl: './listar-aulas-curso.component.html',
  styleUrls: ['./listar-aulas-curso.component.scss']
})
export class ListarAulasCursoComponent extends BaseComponent implements OnInit {

  @Input() aulas: Aula[] = [];
  @Input() mostrarAcoes: boolean;
  @Input() nomeCurso: string;

  constructor() { super(); }

  ngOnInit(): void {
  }

}

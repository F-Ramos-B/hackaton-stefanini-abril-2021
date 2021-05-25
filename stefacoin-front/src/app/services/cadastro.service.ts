import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import Mensagem from '../models/mensagem';
import { CadastroForm } from './../models/cadastro-form';
import { BaseService } from './base.service';

const URL = 'http://localhost:3000/stefanini/cadastrar';

@Injectable({
  providedIn: 'root',
})
export class CadastroService extends BaseService {

  cadastrar(usuario: CadastroForm): Observable<Mensagem> {
    return this.takeFilter(this.http.post<Mensagem>(URL, usuario));
  }

}

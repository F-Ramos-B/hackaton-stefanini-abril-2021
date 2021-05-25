import { Usuario } from 'src/app/models/usuario';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';

const URL = 'http://localhost:3000/stefanini/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseService {

  obterPorId(id: number): Observable<Usuario> {
    return this.takeFilter(this.http.get<Usuario>(`${URL}/${id}`));
  }

  gerarJSONExemplo(): Observable<any> {
    return this.http.get<any>('https://random-data-api.com/api/vehicle/random_vehicle');
  }

}

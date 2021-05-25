import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

import { Login } from '../models/login';
import { UsuarioToken } from '../models/usuario-token';
import { BaseService } from './base.service';

const URL = 'http://localhost:3000/stefanini/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  nameToken: string = 'jwttoken';
  usuario: UsuarioToken;

  constructor(private router: Router, protected http: HttpClient, public jwtHelper: JwtHelperService) { super(http); }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.nameToken);
    return !this.jwtHelper.isTokenExpired(token || undefined);
  }

  getUsuario(): UsuarioToken {
    this.usuario = JSON.parse(localStorage.getItem('user'));
    return this.usuario;
  }

  setUsuario(usuario: UsuarioToken) {
    localStorage.setItem('user', JSON.stringify(usuario));
  }

  auth(email: string, senha: string): Observable<Login> {
    return this.takeFilter(this.http.post<Login>(URL, { email, senha }));
  }

  getToken(): string {
    return localStorage.getItem(this.nameToken) || '';
  }

  setToken(token: string) {
    localStorage.setItem(this.nameToken, token);
  }

  logout() {
    localStorage.removeItem(this.nameToken);
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
}

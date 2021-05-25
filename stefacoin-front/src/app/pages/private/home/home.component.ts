import { Observable } from 'rxjs';
import { UsuarioService } from './../../../services/usuario.service';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  exemplo$: Observable<any>;

  constructor(private authService: AuthService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.gerarJSON();
  }

  gerarJSON() {
    this.exemplo$ = this.usuarioService.gerarJSONExemplo();
  }

  logout() {
    this.authService.logout();
  }

}

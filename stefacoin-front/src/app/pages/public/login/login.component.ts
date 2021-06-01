import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { BaseComponent } from './../../../components/shared/base.component';
import { FormUtils } from './../../../utils/form-utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    senha: new FormControl(null, Validators.required)
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { super(); }

  ngOnInit(): void { }

  validate() {
    FormUtils.forceValidateForm(this.loginForm, this.login.bind(this));
  }

  login() {
    this.authService.auth(this.email?.value, this.senha?.value).subscribe(login => {
      this.toastSucesso(`Login realizado com sucesso! Seja bem-vindo ${login.usuario.nome}.`);
      console.table(login.usuario);
      this.authService.setToken(login.token);
      this.authService.setUsuario(login.usuario);
      this.router.navigate(['']);
    });
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get senha(): FormControl {
    return this.loginForm.get('senha') as FormControl;
  }
}

import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

import { EnumTipoUsuario } from '../../enums/enum-tipo-usuario.model';
import { UsuarioToken } from './../../models/usuario-token';
import { TipoUsuarioPipe } from './../../pipes/tipo-usuario.pipe';
import { BaseComponent } from './../shared/base.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent extends BaseComponent implements OnInit {

  private readonly titleCasePipe = new TitleCasePipe();
  private readonly tipoUsuarioPipe = new TipoUsuarioPipe();

  menuItems: MenuItem[] = [];
  usuario: UsuarioToken;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { super(); }

  ngOnInit(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd), takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.usuario = this.authService.getUsuario();
      this.buildMenu();
    });
  }

  showHeader() {
    return this.authService.isAuthenticated();
  }

  isProfessor() {
    return EnumTipoUsuario.is.PROFESSOR(this.usuario?.tipo);
  }

  buildMenu() {
    this.menuItems = [
      {
        label: 'Página inicial',
        icon: 'pi pi-fw pi-home',
        routerLink: ['']
      },
      {
        label: `Área do ${this.tipoUsuarioPipe.transform(this.usuario?.tipo)}`,
        icon: 'pi pi-fw pi-id-card',
        items: [...this.buildAreaMenu(this.isProfessor())]
      },
      {
        label: 'Deslogar',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.authService.logout()
      }
    ];
  }

  private buildAreaMenu(podeIncluir: boolean): MenuItem[] {
    return [
      this.buildSubMenu('professores', 'pi-user', podeIncluir, EnumTipoUsuario.PROFESSOR.id),
      this.buildSubMenu('alunos', 'pi-user-edit', podeIncluir, EnumTipoUsuario.ALUNO.id),
      this.buildSubMenu('cursos', 'pi-book', podeIncluir)
    ];
  }

  buildSubMenu(nome: string, icon: string, podeIncluir: boolean = true, tipo?: number): MenuItem {
    const menu: MenuItem = {
      label: `${this.titleCasePipe.transform(nome)}`,
      icon: `pi pi-fw ${icon}`
    };

    if (podeIncluir) {
      menu.items = [...this.buildSubMenuCrud(nome, podeIncluir, tipo)];
    } else {
      menu.routerLink = [`/${nome}`];
    }

    return menu;
  }

  buildSubMenuCrud(nome: string, podeIncluir: boolean, tipo?: number): MenuItem[] {
    const menuItem: MenuItem = {
      label: 'Incluir',
      icon: 'pi pi-fw pi-plus-circle',
      visible: podeIncluir
    }

    if (tipo) {
      menuItem.command = () => this.router.navigate([nome, 'incluir'], { state: { tipo } });
    } else {
      menuItem.routerLink = [`/${nome}/incluir`];
    }

    return [
      {
        label: 'Listar',
        icon: 'pi pi-fw pi-list',
        routerLink: [`/${nome}`]
      },
      menuItem
    ];
  }

}

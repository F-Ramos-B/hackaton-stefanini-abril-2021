import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlSegment } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export abstract class TipoUsuarioGuard implements CanActivate, CanActivateChild {
  constructor(protected auth: AuthService, protected router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.verificarTipo(route.url)) {
      return true;
    }

    this.router.navigate(['']);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.auth.isAuthenticated() && this.canActivate(route);
  }

  protected abstract verificarTipo(url: UrlSegment[]): boolean;

}

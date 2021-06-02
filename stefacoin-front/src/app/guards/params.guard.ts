import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ParamsGuard {
  static forParams(requiredParams: string[], requireAll: boolean = true) {

    @Injectable({
      providedIn: 'root'
    })
    class ParamGuard implements CanActivate, CanActivateChild {
      constructor(protected auth: AuthService, protected router: Router) { }

      canActivate(): boolean {
        return this.hasParams();
      }

      canActivateChild(): boolean {
        return this.hasParams();
      }

      hasParams(): boolean {
        const extras = this.router.getCurrentNavigation()?.extras?.state;

        if (!extras) {
          this.router.navigate(['']);
          return false;
        }

        return requiredParams[requireAll ? 'every' : 'some'](key => key in extras && extras[key]);
      }
    }

    return ParamGuard;
  }

}

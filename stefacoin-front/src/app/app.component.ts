import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from './services/toast.service';
import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  template: ` <app-header></app-header>
    <p-toast></p-toast>
    <div class="container p-component">
      <p-card class="card-app-content">
        <router-outlet></router-outlet>
      </p-card>
      <!-- <router-outlet name="public"></router-outlet> -->
    </div>`
})
export class AppComponent {
  title = 'stefacoin-front';

  constructor(
    private primengConfig: PrimeNGConfig,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {
    this.toastService.init();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.router.navigate(this.authService.isAuthenticated() ? [''] : ['/login']);
  }
}

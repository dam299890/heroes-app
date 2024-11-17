import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  constructor( private authService: AuthService,
                private router: Router,
              ) {}

  get user(): User | undefined {
    return this.authService.currentUser();
  }
  onLogout() {
   this.authService.logout();
   this.router.navigate(['/auth/login']);
  }

  public sideBarItems = [
    {
      label: 'Listado',
      icon: 'label',
      url: './list'
    },
    {
      label: 'Añadir',
      icon: 'add',
      url: './new-hero'
    },
    {
      label: 'Buscar',
      icon: 'search',
      url: './search'
    }
  ];
}

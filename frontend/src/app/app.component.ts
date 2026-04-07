import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  currentPath = '';

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.currentPath = this.router.url;
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentPath = this.router.url;
    });
  }

  get showNavbar(): boolean {
    return !['/login', '/register'].includes(this.currentPath);
  }

  logout(): void {
    this.authService.logout();
  }
}

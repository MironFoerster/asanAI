import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LandingComponent } from '../landing/landing.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LandingComponent, DashboardComponent, RouterOutlet, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  auth = inject(AuthService)
  isScrolled: boolean = false

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const scrollY = window.scrollY
    this.isScrolled = scrollY >   50
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';
  router = inject(Router)
  auth = inject(AuthService)
  currentRoute: string = "";
  isSignIn: boolean = false;
  isSignUp: boolean = false;
  isLab: boolean = false;
  private destroy$ = new Subject<void>();
  isDashboard: boolean = false;
  
  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
  ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      this.isSignIn = this.currentRoute.includes("signin")
      this.isSignUp = this.currentRoute.includes("signup")
      this.isDashboard = this.currentRoute.includes("dashboard")
      this.isLab = this.currentRoute.includes("lab") && !this.currentRoute.includes("labs")
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent {
  @Input() returnRoute?: string = "";
  
  router = inject(Router)
  auth = inject(AuthService)
  
  signupData = {username: "", email: "", password: ""}


  signupSuccess(res: { token: string; }) {
    localStorage.setItem('token', res.token);
    this.router.navigate([this.returnRoute || ""]);
  }

  signupFailure(err: { message: any; }) {
    console.log(err.message)
  }

  signupUser() {
    this.auth.signupUser(this.signupData)
      .subscribe({next: this.signupSuccess.bind(this), error: this.signupFailure.bind(this)})
  }
}

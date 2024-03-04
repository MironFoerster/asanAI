import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.sass'
})
export default class SigninComponent {
  @Input() returnRoute?: string

  router = inject(Router)
  auth = inject(AuthService)


  signinData: any = {username: "", password: ""}

  signinSuccess(res: { token: string; }) {
    console.log("signin success")
    localStorage.setItem('token', res.token);
    console.log("back to"+this.returnRoute)
    this.router.navigate([this.returnRoute||""]);
  }

  signinFailure(err: { message: any; }) {
    console.log("signin failure")
    console.log(err.message)
  }

  signinUser() {
    this.auth.signinUser(this.signinData)
      .subscribe({next: this.signinSuccess.bind(this), error: this.signinFailure.bind(this)})
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _signInUrl = "auth/signin/"
  private _signOutUrl = "auth/signout/"
  private _signUpUrl = "auth/signup/"

  private username = ""

  http = inject(HttpClient)
  api = inject(ApiService)
  router = inject(Router)

  signupUser(user: any): Observable<any> {
    return this.api.post(this._signUpUrl, user).pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('username', response.username)
      })
    )
  }
  
  signinUser(user: any): Observable<any> {
    return this.api.post(this._signInUrl, user).pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('username', response.username)
      })
    )
  }

  signoutUser() {
    this.api.post(this._signOutUrl, {"username": sessionStorage.getItem("username")})
    if (sessionStorage.getItem("token")) {
      sessionStorage.clear();
    }
    this.router.navigate([""])
  }

  isAuthenticated() {
    return !! sessionStorage.getItem('token')
  }

  getToken() {
    return sessionStorage.getItem('token')
  }

  getUsername() {
    return sessionStorage.getItem('username')
  }
}

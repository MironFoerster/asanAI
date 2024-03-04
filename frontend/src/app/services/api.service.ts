import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiHeaders = new HttpHeaders({
    'X-ApiRequest': 'true'
  })

  http = inject(HttpClient)

  get(apiUrl: string): Observable<any> {
    console.log("api/"+apiUrl)
    return this.http.get("api/"+apiUrl, {headers: this.apiHeaders});
  }
  
  post(apiUrl: string, data: any): Observable<any> {
    if (typeof data !== "object") {
      data = {error: "unable to send data"};
    }
    return this.http.post(apiUrl, data, {headers: this.apiHeaders});
  }

  delete(apiUrl: string): Observable<any> {
    return this.http.delete(apiUrl, {headers: this.apiHeaders});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  constructor(private http: HttpClient) {}

  // Matches PDF API Spec 15.1
  transferFunds(transferRequest: any): Observable<any> {
    return this.http.post('/api/v1/transfers', transferRequest);
  }
}
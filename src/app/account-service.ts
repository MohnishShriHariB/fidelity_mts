import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {}

  // Matches PDF API Spec 15.2
  getAccount(id: number): Observable<any> {
    return this.http.get(`/api/v1/accounts/${id}`);
  }

  getBalance(id: number): Observable<any> {
    return this.http.get(`/api/v1/accounts/${id}/balance`);
  }

  getTransactions(id: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/v1/accounts/${id}/transactions`);
  }
}
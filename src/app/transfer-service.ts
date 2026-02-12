import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransferRequest } from './models/transfer-request.interface';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  constructor(private http: HttpClient) {}

  // Matches PDF API Spec 15.1
  transferFunds(transferRequest: TransferRequest): Observable<any> {
    return this.http.post('/api/v1/transfers', transferRequest);
  }
}

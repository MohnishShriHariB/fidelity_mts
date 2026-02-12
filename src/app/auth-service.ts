import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface Account {
  id: number;
  holderName: string;
  balance: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private commonPassword = 'password123';
  private currentUserKey = 'currentUser';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(accountId: string, password: string): Observable<boolean> {
    // 1. Common password check (same for all users)
    if (password !== this.commonPassword) {
      return throwError(() => new Error('Invalid password'));
    }

    // 2. Check if username/account exists in DB via backend
    return this.http.get<Account>(`/api/v1/accounts/${accountId}`).pipe(
      tap((account) => {
        if (this.isBrowser) {
          // Store the full account; account.id is your "accountId"/username
          localStorage.setItem(this.currentUserKey, JSON.stringify(account));
        }
      }),
      map(() => true),
      catchError((err) => {
        if (err.status === 404) {
          return throwError(() => new Error('Account not found'));
        }
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  isUserLoggedin(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.currentUserKey);
  }

  getCurrentUser(): any {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.currentUserKey);
    }
    this.router.navigate(['/login']);
  }
  get username(): string {
    const user = this.getCurrentUser() as Account | null;
    return user ? String(user.id) : '';
  }

  get password(): string {
    return this.commonPassword;
  }
}
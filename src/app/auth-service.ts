import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	username = '';
	password = '';

	private commonPassword = 'password123';
	private currentUserKey = 'currentUser';
	private isBrowser: boolean;

	constructor(
		private http: HttpClient,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	isUserLoggedin(): boolean {
		if (!this.isBrowser) return false;
		return !!localStorage.getItem(this.currentUserKey);
	}

	login(accountId: string, password: string): Observable<boolean> {
		if (password !== this.commonPassword) {
			return throwError(() => new Error('Invalid Password'));
		}

		if (this.isBrowser) {
			localStorage.setItem(this.currentUserKey, JSON.stringify({ accountId }));
		}

		return of(true);
	}

	logout(): void {
		if (this.isBrowser) {
			localStorage.removeItem(this.currentUserKey);
		}
		this.username = '';
		this.password = '';
		this.router.navigate(['/login']);
	}

	getCurrentUser(): any {
		if (!this.isBrowser) return null;
		const user = localStorage.getItem(this.currentUserKey);
		return user ? JSON.parse(user) : null;
	}
}
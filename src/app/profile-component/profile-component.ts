import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AccountService } from '../account-service';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef, 
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProfile();
    } else {
      // If rendering on server, we can't load profile from localstorage
      // But we shouldn't show a loading spinner forever.
      this.isLoading = true; 
    }
  }

  loadProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log("Loading profile for:", currentUser);
    
    if (currentUser && currentUser.id) {
      this.accountService.getAccount(currentUser.id).subscribe({
        next: (data) => {
          this.user = data;
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Failed to load profile data.';
          this.isLoading = false;
          this.cd.detectChanges();
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'No user session found. Please login again.';
      this.isLoading = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
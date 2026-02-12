import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { AccountService } from '../account-service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  balance: number = 0;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.refreshBalance();
    }
  }

  refreshBalance() {
    this.accountService.getBalance(this.user.id).subscribe({
      next: (data) => {
        // Backend returns BigDecimal directly, not wrapped in an object
        this.balance = typeof data === 'number' ? data : Number(data);
        console.log('Balance loaded:', this.balance);
      },
      error: (err) => {
        console.error('Error loading balance:', err);
        this.balance = 0;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
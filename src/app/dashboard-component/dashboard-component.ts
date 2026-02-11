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
    this.accountService.getBalance(this.user.id).subscribe(data => {
      // Assuming API returns { balance: 1000.00 } or just the number depending on backend
      this.balance = data.balance !== undefined ? data.balance : data; 
    });
  }

  logout() {
    this.authService.logout();
  }
}
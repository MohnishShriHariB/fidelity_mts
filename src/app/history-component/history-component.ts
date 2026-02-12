import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { AccountService } from '../account-service';

@Component({
  selector: 'app-history',
  templateUrl: './history-component.html',
  standalone: false,
  styleUrls: ['./history-component.css']
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  currentUser: any;
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadHistory();
    } else {
      this.error = 'User not found. Please login again.';
    }
  }

  loadHistory() {
    this.isLoading = true;
    this.error = null;
    
    this.accountService.getTransactions(this.currentUser.id).subscribe({
      next: (data) => {
        console.log('Transactions loaded:', data);
        if (data && Array.isArray(data)) {
          this.transactions = data.map(tx => ({
            ...tx,
            type: tx.fromAccountId === this.currentUser.id ? 'DEBIT' : 'CREDIT'
          }));
        } else {
          this.transactions = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.error = err.error?.message || 'Failed to load transaction history';
        this.transactions = [];
        this.isLoading = false;
      }
    });
  }
}
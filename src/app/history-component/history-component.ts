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

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadHistory();
  }

  loadHistory() {
    this.accountService.getTransactions(this.currentUser.id).subscribe(data => {
      this.transactions = data.map(tx => ({
        ...tx,
        type: tx.fromAccountId === this.currentUser.id ? 'DEBIT' : 'CREDIT'
      }));
    });
  }
}
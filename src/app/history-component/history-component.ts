import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
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
  filteredTransactions: any[] = []; // List to display in UI
  currentUser: any;
  isLoading = false;
  error: string | null = null;
  activeFilter: 'ALL' | 'SENT' | 'RECEIVED' = 'ALL';

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser() || 
                       { id: localStorage.getItem('activeAccountId') };

    if (this.currentUser?.id) {
      this.loadHistory();
    } else {
      this.error = 'No active user found. Please log in.';
    }
  }

  loadHistory() {
    this.isLoading = true;
    this.accountService.getTransactions(this.currentUser.id).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.transactions = data.map(tx => ({
            ...tx,
            // Logic: If I sent it, it's a DEBIT/SENT
            type: (tx.fromAccountId === this.currentUser.id) ? 'DEBIT' : 'CREDIT'
          }));
          this.applyFilter('ALL'); // Default view
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load transaction history';
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  applyFilter(type: 'ALL' | 'SENT' | 'RECEIVED') {
    this.activeFilter = type;
    if (type === 'ALL') {
      this.filteredTransactions = this.transactions;
    } else if (type === 'SENT') {
      this.filteredTransactions = this.transactions.filter(tx => tx.type === 'DEBIT');
    } else {
      this.filteredTransactions = this.transactions.filter(tx => tx.type === 'CREDIT');
    }
  }
}
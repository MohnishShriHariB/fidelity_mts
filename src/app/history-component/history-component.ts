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
  currentUser: any;
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private cdRef: ChangeDetectorRef // Inject it here
  ) {}

  ngOnInit(): void {
    // 1. Try getting user from Service
    this.currentUser = this.authService.getCurrentUser();

    // 2. FALLBACK: If service is empty (common on refresh), try LocalStorage directly
    if (!this.currentUser) {
      const storedId = localStorage.getItem('activeAccountId'); // Or 'accountID' based on your login logic
      if (storedId) {
        this.currentUser = { id: storedId, username: storedId };
      }
    }

    // 3. Only load if we found a user
    if (this.currentUser) {
      this.loadHistory();
    } else {
      this.error = 'No active user found. Please log in.';
      this.cdRef.detectChanges(); // Update UI to show error immediately
    }
  }

  loadHistory() {
    this.isLoading = true;
    this.error = null;
    
    // Force UI update to show "Loading..." spinner
    this.cdRef.detectChanges(); 

    this.accountService.getTransactions(this.currentUser.id).subscribe({
      next: (data) => {
        console.log('Transactions loaded:', data);
        
        if (data && Array.isArray(data)) {
          this.transactions = data.map(tx => ({
            ...tx,
            // Safe check for fromAccountId
            type: (tx.fromAccountId === this.currentUser.id) ? 'DEBIT' : 'CREDIT'
          }));
        } else {
          this.transactions = [];
        }

        this.isLoading = false;

        // --- THE FIX IS HERE ---
        // Manually trigger detection NOW that data is ready.
        this.cdRef.detectChanges(); 
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.error = 'Failed to load transaction history';
        this.transactions = [];
        this.isLoading = false;
        
        // Update UI to show error message
        this.cdRef.detectChanges();
      }
    });
  }
}
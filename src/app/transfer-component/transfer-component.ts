import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { TransferService } from '../transfer-service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { TransferRequest } from '../models/transfer-request.interface';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer-component.html',
  standalone: false,
  styleUrls: ['./transfer-component.css']
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  currentUser: any;
  isLoading = false;
  message: { type: string, text: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private transferService: TransferService,
    private router: Router
  ) {
    this.transferForm = this.fb.group({
      toAccountId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  onSubmit() {
    if (this.transferForm.invalid) return;

    this.isLoading = true;
    this.message = null;

    // Ensure proper type conversion
    const toAccountId = Number(this.transferForm.value.toAccountId);
    const amount = Number(this.transferForm.value.amount);
    const fromAccountId = Number(this.currentUser.id);

    // Validate conversions
    if (isNaN(toAccountId) || toAccountId <= 0) {
      this.message = { type: 'error', text: 'Invalid destination account ID' };
      this.isLoading = false;
      return;
    }

    if (isNaN(amount) || amount < 0.01) {
      this.message = { type: 'error', text: 'Amount must be at least 0.01' };
      this.isLoading = false;
      return;
    }

    if (isNaN(fromAccountId) || fromAccountId <= 0) {
      this.message = { type: 'error', text: 'Invalid source account ID' };
      this.isLoading = false;
      return;
    }

    // Check if transferring to same account
    if (fromAccountId === toAccountId) {
      this.message = { type: 'error', text: 'Cannot transfer to the same account' };
      this.isLoading = false;
      return;
    }

    const request: TransferRequest = {
      fromAccountId: fromAccountId,
      toAccountId: toAccountId,
      amount: amount,
      idempotencyKey: uuidv4()
    };

    // Logging for debugging
    console.log('Sending transfer request:', request);
    console.log('Types:', {
      fromAccountId: typeof request.fromAccountId,
      toAccountId: typeof request.toAccountId,
      amount: typeof request.amount
    });
    console.log('Raw form values:', {
      toAccountId: this.transferForm.value.toAccountId,
      amount: this.transferForm.value.amount,
      currentUser: this.currentUser
    });

    this.transferService.transferFunds(request).subscribe({
      next: (res) => {
        console.log('Transfer successful:', res);
        this.message = { type: 'success', text: 'Transfer Successful!' };
        this.isLoading = false;
        this.transferForm.reset();
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        console.error('Transfer error:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.error?.message
        });
        const errorMsg = err.error?.message || 'Transfer failed. Please try again.';
        this.message = { type: 'error', text: errorMsg };
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
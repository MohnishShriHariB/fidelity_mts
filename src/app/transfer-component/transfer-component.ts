/* import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { TransferService } from '../transfer-service';
import { AccountService } from '../account-service';
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
  recipientName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private transferService: TransferService,
    private accountService: AccountService,
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

   checkRecipient() {
    const toId = this.transferForm.get('toAccountId')?.value;
    
    // Reset messages if empty
    if (!toId) {
      this.recipientName = null;
      return;
    }

    // Don't check if it's the same as sender (validation handles that later, or we can catch here)
    if (String(toId) === String(this.currentUser.id)) {
      this.message = { type: 'error', text: 'You cannot transfer to your own account.' };
      this.recipientName = null;
      return;
    }

    this.isLoading = true; // Show small loading indication if desired
    
    this.accountService.getAccount(Number(toId)).subscribe({
      next: (account) => {
        this.isLoading = false;
        
        // CHECK: Is the account Locked/Closed?
        if (account.status === 'LOCKED') {
          this.message = { type: 'error', text: 'Recipient Account is LOCKED. Cannot transfer.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'locked': true });
          this.recipientName = null;
        } 
        else if (account.status === 'CLOSED') {
          this.message = { type: 'error', text: 'Recipient Account is CLOSED. Cannot transfer.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'closed': true });
          this.recipientName = null;
        } 
        else if (account.status === 'INACTIVE') {
          this.message = { type: 'error', text: 'Recipient Account is INACTIVE.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'inactive': true });
          this.recipientName = null;
        }
        else {
          // Valid Account
          this.message = null; // Clear errors
          this.recipientName = account.holderName; // Show name for confirmation
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.recipientName = null;
        if (err.status === 404) {
          this.message = { type: 'error', text: 'Account ID not found.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'notFound': true });
        } else {
          console.error(err);
        }
      }
    });
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
} */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { TransferService } from '../transfer-service';
import { AccountService } from '../account-service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { TransferRequest } from '../models/transfer-request.interface';
import { ChangeDetectorRef } from '@angular/core';

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

  recipientName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private transferService: TransferService,
    private accountService: AccountService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.transferForm = this.fb.group({
      toAccountId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

// 3. New Method: Check Recipient on Blur
  checkRecipient() {
    const toId = this.transferForm.get('toAccountId')?.value;
    
    // Reset messages if empty
    if (!toId) {
      this.recipientName = null;
      return;
    }

    // Don't check if it's the same as sender (validation handles that later, or we can catch here)
    if (String(toId) === String(this.currentUser.id)) {
      this.message = { type: 'error', text: 'You cannot transfer to your own account.' };
      this.recipientName = null;
      return;
    }

    this.isLoading = true; // Show small loading indication if desired
    
    this.accountService.getAccount(Number(toId)).subscribe({
      next: (account) => {
        this.isLoading = false;
        
        // CHECK: Is the account Locked/Closed?
        if (account.status === 'LOCKED') {
          this.message = { type: 'error', text: 'Recipient Account is LOCKED. Cannot transfer.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'locked': true });
          this.recipientName = null;
          this.cd.detectChanges(); // Ensure UI updates immediately
        } 
        else if (account.status === 'CLOSED') {
          this.message = { type: 'error', text: 'Recipient Account is CLOSED. Cannot transfer.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'closed': true });
          this.recipientName = null;
          this.cd.detectChanges();
        } 
        else if (account.status === 'INACTIVE') {
          this.message = { type: 'error', text: 'Recipient Account is INACTIVE.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'inactive': true });
          this.recipientName = null;
          this.cd.detectChanges();
        }
        else {
          // Valid Account
          this.message = null; // Clear errors
          this.recipientName = account.holderName; // Show name for confirmation
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.recipientName = null;
        if (err.status === 404) {
          this.message = { type: 'error', text: 'Account ID not found.' };
          this.transferForm.get('toAccountId')?.setErrors({ 'notFound': true });
        } else {
          console.error(err);
        }
        this.cd.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.transferForm.invalid) return;

    this.isLoading = true;
    this.message = null;
    this.cd.detectChanges(); // Ensure loading state updates immediately

    // Ensure proper type conversion
    const toAccountId = Number(this.transferForm.value.toAccountId);
    const amount = Number(this.transferForm.value.amount);
    const fromAccountId = Number(this.currentUser.id);

    // Validate conversions
    if (isNaN(toAccountId) || toAccountId <= 0) {
      this.message = { type: 'error', text: 'Invalid destination account ID' };
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    if (isNaN(amount) || amount < 0.01) {
      this.message = { type: 'error', text: 'Amount must be at least 0.01' };
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    if (isNaN(fromAccountId) || fromAccountId <= 0) {
      this.message = { type: 'error', text: 'Invalid source account ID' };
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    // Check if transferring to same account
    if (fromAccountId === toAccountId) {
      this.message = { type: 'error', text: 'Cannot transfer to the same account' };
      this.isLoading = false;
      this.cd.detectChanges();
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

        this.cd.detectChanges();

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

        this.cd.detectChanges();
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
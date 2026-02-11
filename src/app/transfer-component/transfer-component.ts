import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { TransferService } from '../transfer-service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

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

    const request = {
      fromAccountId: this.currentUser.id,
      toAccountId: this.transferForm.value.toAccountId,
      amount: this.transferForm.value.amount,
      idempotencyKey: uuidv4()
    };

    this.transferService.transferFunds(request).subscribe({
      next: (res) => {
        this.message = { type: 'success', text: 'Transfer Successful!' };
        this.isLoading = false;
        this.transferForm.reset();
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
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
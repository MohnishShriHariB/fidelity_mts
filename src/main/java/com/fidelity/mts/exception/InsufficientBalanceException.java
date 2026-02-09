package com.fidelity.mts.exception;

import java.math.BigDecimal;

public class InsufficientBalanceException extends RuntimeException {
    
    public InsufficientBalanceException(String message) {
        super(message);
    }
    
    public InsufficientBalanceException(Long accountId, BigDecimal currentBalance, BigDecimal requestedAmount) {
        super(String.format("Insufficient balance in account %d. Current balance: %.2f, Requested: %.2f", 
            accountId, currentBalance, requestedAmount));
    }
}
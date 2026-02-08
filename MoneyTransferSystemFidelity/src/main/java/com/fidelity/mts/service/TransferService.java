package com.fidelity.mts.service;


import com.fidelity.mts.dto.TransferRequest;
import com.fidelity.mts.dto.TransferResponse;
import com.fidelity.mts.entity.Account;
import com.fidelity.mts.entity.TransactionLog;
import com.fidelity.mts.enums.TransactionStatus;
import com.fidelity.mts.exception.*;
import com.fidelity.mts.repository.AccountRepository;
import com.fidelity.mts.repository.TransactionLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service class for money transfer operations.
 */
@Service
@Transactional
public class TransferService {
    
    private static final Logger log = LoggerFactory.getLogger(TransferService.class);
    
    private final AccountRepository accountRepository;
    private final TransactionLogRepository transactionLogRepository;
    
    @Autowired
    public TransferService(AccountRepository accountRepository,
                          TransactionLogRepository transactionLogRepository) {
        this.accountRepository = accountRepository;
        this.transactionLogRepository = transactionLogRepository;
    }
    
    /**
     * Execute a money transfer from one account to another.
     */
    public TransferResponse transfer(TransferRequest request) {
        log.info("Processing transfer request: {} -> {}, Amount: {}", 
            request.getFromAccountId(), request.getToAccountId(), request.getAmount());
        
        // Validate transfer request
        validateTransfer(request);
        
        // Check for duplicate transfer
        checkDuplicate(request.getIdempotencyKey());
        
        // Fetch both accounts
        Account fromAccount = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() -> new AccountNotFoundException(request.getFromAccountId()));
        
        Account toAccount = accountRepository.findById(request.getToAccountId())
                .orElseThrow(() -> new AccountNotFoundException(request.getToAccountId()));
        
        try {
            // Verify both accounts are active
            if (!fromAccount.isActive()) {
                throw new AccountNotActiveException(fromAccount.getId(), fromAccount.getStatus().name());
            }
            if (!toAccount.isActive()) {
                throw new AccountNotActiveException(toAccount.getId(), toAccount.getStatus().name());
            }
            
            // Check sufficient balance
            if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
                throw new InsufficientBalanceException(
                    fromAccount.getId(), 
                    fromAccount.getBalance(), 
                    request.getAmount()
                );
            }
            
            // Debit from source, credit to destination
            fromAccount.debit(request.getAmount());
            toAccount.credit(request.getAmount());
            
            // Save both accounts to database
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            
            // Log successful transaction
            String transactionId = UUID.randomUUID().toString();
            TransactionLog transactionLog = createTransactionLog(
                transactionId,
                request,
                TransactionStatus.SUCCESS,
                null
            );
            transactionLogRepository.save(transactionLog);
            
            log.info("Transfer completed successfully. Transaction ID: {}", transactionId);
            
            // Return success response
            TransferResponse response = new TransferResponse();
            response.setTransactionId(transactionId);
            response.setStatus("SUCCESS");
            response.setMessage("Transfer completed successfully");
            response.setDebitedFrom(request.getFromAccountId());
            response.setCreditedTo(request.getToAccountId());
            response.setAmount(request.getAmount());
            
            return response;
            
        } catch (Exception e) {
            // Log failed transaction
            String transactionId = UUID.randomUUID().toString();
            TransactionLog failedLog = createTransactionLog(
                transactionId,
                request,
                TransactionStatus.FAILED,
                e.getMessage()
            );
            transactionLogRepository.save(failedLog);
            
            log.error("Transfer failed: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Validate transfer request according to business rules.
     */
    private void validateTransfer(TransferRequest request) {
        if (request.getFromAccountId().equals(request.getToAccountId())) {
            throw new InvalidTransferException(
                "Cannot transfer to the same account. Source and destination must be different."
            );
        }
        
        if (request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new InvalidTransferException("Transfer amount must be greater than zero");
        }
    }
    
    /**
     * Check if the idempotency key has already been used.
     */
    private void checkDuplicate(String idempotencyKey) {
        if (transactionLogRepository.existsByIdempotencyKey(idempotencyKey)) {
            throw new DuplicateTransferException(idempotencyKey);
        }
    }
    
    /**
     * Create a TransactionLog entity.
     */
    private TransactionLog createTransactionLog(
            String transactionId,
            TransferRequest request,
            TransactionStatus status,
            String failureReason
    ) {
        TransactionLog transactionLog = new TransactionLog();
        transactionLog.setId(transactionId);
        transactionLog.setFromAccountId(request.getFromAccountId());
        transactionLog.setToAccountId(request.getToAccountId());
        transactionLog.setAmount(request.getAmount());
        transactionLog.setStatus(status);
        transactionLog.setFailureReason(failureReason);
        transactionLog.setIdempotencyKey(request.getIdempotencyKey());
        
        return transactionLog;
    }
}
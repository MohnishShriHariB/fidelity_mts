package com.fidelity.mts.service;

import com.fidelity.mts.dto.AccountResponse;
import com.fidelity.mts.dto.TransactionResponse;
import com.fidelity.mts.entity.Account;
import com.fidelity.mts.entity.TransactionLog;
import com.fidelity.mts.exception.AccountNotFoundException;
import com.fidelity.mts.repository.AccountRepository;
import com.fidelity.mts.repository.TransactionLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional(readOnly = true)
public class AccountService {
    
    private static final Logger log = LoggerFactory.getLogger(AccountService.class);
    
    private final AccountRepository accountRepository;
    private final TransactionLogRepository transactionLogRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository, 
                         TransactionLogRepository transactionLogRepository) {
        this.accountRepository = accountRepository;
        this.transactionLogRepository = transactionLogRepository;
    }
    
    public AccountResponse getAccount(Long accountId) {
        log.info("Fetching account details for ID: {}", accountId);
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException(accountId));
        
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setHolderName(account.getHolderName());
        response.setBalance(account.getBalance());
        response.setStatus(account.getStatus().name());
        
        return response;
    }
    
    public BigDecimal getBalance(Long accountId) {
        log.info("Fetching balance for account ID: {}", accountId);
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException(accountId));
        
        return account.getBalance();
    }
    
    public List<TransactionResponse> getTransactions(Long accountId) {
        log.info("Fetching transaction history for account ID: {}", accountId);
        
        if (!accountRepository.existsById(accountId)) {
            throw new AccountNotFoundException(accountId);
        }
        
        List<TransactionLog> transactions = transactionLogRepository
                .findByFromAccountIdOrToAccountId(accountId, accountId);
        
        return transactions.stream()
                .map(this::convertToTransactionResponse)
                .collect(Collectors.toList());
    }
    
    private TransactionResponse convertToTransactionResponse(TransactionLog transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setFromAccountId(transaction.getFromAccountId());
        response.setToAccountId(transaction.getToAccountId());
        response.setAmount(transaction.getAmount());
        response.setStatus(transaction.getStatus().name());
        response.setFailureReason(transaction.getFailureReason());
        response.setCreatedOn(transaction.getCreatedOn());
        
        return response;
    }
}
package com.fidelity.mts.controller;


import com.fidelity.mts.dto.AccountResponse;
import com.fidelity.mts.dto.TransactionResponse;
import com.fidelity.mts.service.AccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@CrossOrigin(origins = "*")
public class AccountController {
    
    private static final Logger log = LoggerFactory.getLogger(AccountController.class);
    
    private final AccountService accountService;
    
    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable Long id) {
        log.info("Fetching account with ID: {}", id);
        
        AccountResponse account = accountService.getAccount(id);
        
        return ResponseEntity.ok(account);
    }
    
    @GetMapping("/{id}/balance")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable Long id) {
        log.info("Fetching balance for account ID: {}", id);
        
        BigDecimal balance = accountService.getBalance(id);
        
        return ResponseEntity.ok(balance);
    }
    
    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(@PathVariable Long id) {
        log.info("Fetching transactions for account ID: {}", id);
        
        List<TransactionResponse> transactions = accountService.getTransactions(id);
        
        return ResponseEntity.ok(transactions);
    }
    
    /**@GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Account API is running");
    }*/
}
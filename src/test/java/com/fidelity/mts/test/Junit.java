package com.fidelity.mts.test;

import com.fidelity.mts.entity.Account;
import com.fidelity.mts.enums.AccountStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Account entity.
 */
class AccountTest {
    
    private Account account;
    
    @BeforeEach
    void setUp() {
        account = new Account();
        account.setId(1L);
        account.setHolderName("Test User");
        account.setBalance(new BigDecimal("1000.00"));
        account.setStatus(AccountStatus.ACTIVE);
        account.setVersion(0);
    }
    
    @Test
    void testDebit_Success() {
        BigDecimal debitAmount = new BigDecimal("500.00");
        BigDecimal expectedBalance = new BigDecimal("500.00");
        
        account.debit(debitAmount);
        
        assertEquals(expectedBalance, account.getBalance());
    }
    
    @Test
    void testDebit_InsufficientBalance() {
        BigDecimal debitAmount = new BigDecimal("1500.00");
        
        assertThrows(IllegalArgumentException.class, 
            () -> account.debit(debitAmount));
    }
    
    @Test
    void testDebit_NegativeAmount() {
        BigDecimal negativeAmount = new BigDecimal("-100.00");
        
        assertThrows(IllegalArgumentException.class,
            () -> account.debit(negativeAmount));
    }
    
    @Test
    void testCredit_Success() {
        BigDecimal creditAmount = new BigDecimal("500.00");
        BigDecimal expectedBalance = new BigDecimal("1500.00");
        
        account.credit(creditAmount);
        
        assertEquals(expectedBalance, account.getBalance());
    }
    
    @Test
    void testCredit_NegativeAmount() {
        BigDecimal negativeAmount = new BigDecimal("-100.00");
        
        assertThrows(IllegalArgumentException.class,
            () -> account.credit(negativeAmount));
    }
    
    @Test
    void testIsActive_ActiveAccount() {
        account.setStatus(AccountStatus.ACTIVE);
        assertTrue(account.isActive());
    }
    
    @Test
    void testIsActive_LockedAccount() {
        account.setStatus(AccountStatus.LOCKED);
        assertFalse(account.isActive());
    }
    
    @Test
    void testIsActive_ClosedAccount() {
        account.setStatus(AccountStatus.CLOSED);
        assertFalse(account.isActive());
    }
}


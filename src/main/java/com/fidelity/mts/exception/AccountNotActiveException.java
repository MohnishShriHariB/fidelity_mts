package com.fidelity.mts.exception;

public class AccountNotActiveException extends RuntimeException {
	    
	    public AccountNotActiveException(String message) {
	        super(message);
	    }
	    
	    public AccountNotActiveException(Long accountId, String status) {
	        super("Account " + accountId + " is not active. Current status: " + status);
	    }
	}
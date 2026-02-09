package com.fidelity.mts.exception;


public class InvalidTransferException extends RuntimeException {
    
    public InvalidTransferException(String message) {
        super(message);
    }
}
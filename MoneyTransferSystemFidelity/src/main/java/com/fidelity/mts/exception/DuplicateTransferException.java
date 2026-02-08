package com.fidelity.mts.exception;

public class DuplicateTransferException extends RuntimeException {

    public DuplicateTransferException(String idempotencyKey) {
        super("Duplicate transfer detected. Idempotency key already used: " + idempotencyKey);
    }
}
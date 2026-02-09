package com.fidelity.mts.dto;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

public class TransferResponse {
    
    private UUID transactionId;
    private String status;
    private String message;
    private Long debitedFrom;
    private Long creditedTo;
    private BigDecimal amount;
    

    public TransferResponse() {
    }
    
    public TransferResponse(UUID transactionId, String status, String message,
                           Long debitedFrom, Long creditedTo, BigDecimal amount) {
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
        this.debitedFrom = debitedFrom;
        this.creditedTo = creditedTo;
        this.amount = amount;
    }
    
    
    public UUID getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(UUID transactionId) {
        this.transactionId = transactionId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Long getDebitedFrom() {
        return debitedFrom;
    }
    
    public void setDebitedFrom(Long debitedFrom) {
        this.debitedFrom = debitedFrom;
    }
    
    public Long getCreditedTo() {
        return creditedTo;
    }
    
    public void setCreditedTo(Long creditedTo) {
        this.creditedTo = creditedTo;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransferResponse that = (TransferResponse) o;
        return Objects.equals(transactionId, that.transactionId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(transactionId);
    }
    
    @Override
    public String toString() {
        return "TransferResponse{" +
                "transactionId='" + transactionId + '\'' +
                ", status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", debitedFrom=" + debitedFrom +
                ", creditedTo=" + creditedTo +
                ", amount=" + amount +
                '}';
    }
}

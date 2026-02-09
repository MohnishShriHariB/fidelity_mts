package com.fidelity.mts.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Objects;

public class TransferRequest {
    
    @NotNull(message = "Source account ID is required")
    @Positive(message = "Source account ID must be positive")
    private Long fromAccountId;
    
    @NotNull(message = "Destination account ID is required")
    @Positive(message = "Destination account ID must be positive")
    private Long toAccountId;
    
    @NotNull(message = "Transfer amount is required")
    @DecimalMin(value = "0.01", message = "Transfer amount must be at least 0.01")
    private BigDecimal amount;
    
    public TransferRequest() {
    }
    
    public TransferRequest(Long fromAccountId, Long toAccountId, BigDecimal amount, String idempotencyKey) {
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
    }
    
    public Long getFromAccountId() {
        return fromAccountId;
    }
    
    public void setFromAccountId(Long fromAccountId) {
        this.fromAccountId = fromAccountId;
    }
    
    public Long getToAccountId() {
        return toAccountId;
    }
    
    public void setToAccountId(Long toAccountId) {
        this.toAccountId = toAccountId;
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
        TransferRequest that = (TransferRequest) o;
        return Objects.equals(fromAccountId, that.fromAccountId) &&
                Objects.equals(toAccountId, that.toAccountId) &&
                Objects.equals(amount, that.amount);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(fromAccountId, toAccountId, amount);
    }
    
    @Override
    public String toString() {
        return "TransferRequest{" +
                "fromAccountId=" + fromAccountId +
                ", toAccountId=" + toAccountId +
                ", amount=" + amount + '\'' +
                '}';
    }
}

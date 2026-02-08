package com.fidelity.mts.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

import com.fidelity.mts.enums.TransactionStatus;
@Entity
@Table(name = "transaction_logs")
public class TransactionLog {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(name = "from_account", nullable = false)
    private Long fromAccountId;
    
    @Column(name = "to_account", nullable = false)
    private Long toAccountId;
    
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status;
    
    @Column(name = "failure_reason")
    private String failureReason;
    
    @Column(name = "idempotency_key", unique = true, nullable = false, length = 100)
    private String idempotencyKey;
    
    @Column(name = "created_on", nullable = false)
    private LocalDateTime createdOn;
    
    public TransactionLog() {
    }
    
    public TransactionLog(String id, Long fromAccountId, Long toAccountId, BigDecimal amount,
                          TransactionStatus status, String failureReason, String idempotencyKey,
                          LocalDateTime createdOn) {
        this.id = id;
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
        this.status = status;
        this.failureReason = failureReason;
        this.idempotencyKey = idempotencyKey;
        this.createdOn = createdOn;
    }
    
    @PrePersist
    protected void onCreate() {
        createdOn = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
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
    
    public TransactionStatus getStatus() {
        return status;
    }
    
    public void setStatus(TransactionStatus status) {
        this.status = status;
    }
    
    public String getFailureReason() {
        return failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public String getIdempotencyKey() {
        return idempotencyKey;
    }
    
    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }
    
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }
    
    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }
    
    // equals, hashCode, and toString methods
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransactionLog that = (TransactionLog) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "TransactionLog{" +
                "id='" + id + '\'' +
                ", fromAccountId=" + fromAccountId +
                ", toAccountId=" + toAccountId +
                ", amount=" + amount +
                ", status=" + status +
                ", failureReason='" + failureReason + '\'' +
                ", idempotencyKey='" + idempotencyKey + '\'' +
                ", createdOn=" + createdOn +
                '}';
    }
}
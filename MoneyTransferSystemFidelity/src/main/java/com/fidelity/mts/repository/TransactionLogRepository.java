package com.fidelity.mts.repository;

import com.fidelity.mts.entity.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface TransactionLogRepository extends JpaRepository<TransactionLog, String> {
    
    List<TransactionLog> findByFromAccountIdOrToAccountId(Long fromAccountId, Long toAccountId);
    
    Optional<TransactionLog> findByIdempotencyKey(String idempotencyKey);
    
    boolean existsByIdempotencyKey(String idempotencyKey);
}
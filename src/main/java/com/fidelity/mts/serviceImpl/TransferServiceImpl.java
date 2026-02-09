package com.fidelity.mts.serviceImpl;

import com.fidelity.mts.dto.TransferRequest;
import com.fidelity.mts.dto.TransferResponse;
import com.fidelity.mts.entity.Account;
import com.fidelity.mts.entity.TransactionLog;
import com.fidelity.mts.enums.TransactionStatus;
import com.fidelity.mts.exception.*;
import com.fidelity.mts.repository.AccountRepository;
import com.fidelity.mts.repository.TransactionLogRepository;
import com.fidelity.mts.service.TransferService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class TransferServiceImpl implements TransferService {

    private static final Logger log = LoggerFactory.getLogger(TransferServiceImpl.class);

    private final AccountRepository accountRepository;
    private final TransactionLogRepository transactionLogRepository;

    @Autowired
    public TransferServiceImpl(AccountRepository accountRepository,
                               TransactionLogRepository transactionLogRepository) {
        this.accountRepository = accountRepository;
        this.transactionLogRepository = transactionLogRepository;
    }

    @Override
    public TransferResponse transfer(TransferRequest request) {
        log.info("Processing transfer request: {} -> {}, Amount: {}",
                request.getFromAccountId(), request.getToAccountId(), request.getAmount());

        validateTransfer(request);

        Account fromAccount = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() -> new AccountNotFoundException(request.getFromAccountId()));

        Account toAccount = accountRepository.findById(request.getToAccountId())
                .orElseThrow(() -> new AccountNotFoundException(request.getToAccountId()));

        try {
            if (!fromAccount.isActive()) {
                throw new AccountNotActiveException(fromAccount.getId(), fromAccount.getStatus().name());
            }
            if (!toAccount.isActive()) {
                throw new AccountNotActiveException(toAccount.getId(), toAccount.getStatus().name());
            }

            if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
                throw new InsufficientBalanceException(
                        fromAccount.getId(),
                        fromAccount.getBalance(),
                        request.getAmount()
                );
            }

            fromAccount.debit(request.getAmount());
            toAccount.credit(request.getAmount());

            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);

            UUID transactionId = UUID.randomUUID();
            TransactionLog transactionLog = createTransactionLog(
                    transactionId,
                    request,
                    TransactionStatus.SUCCESS,
                    null
            );
            transactionLogRepository.save(transactionLog);

            log.info("Transfer completed successfully. Transaction ID: {}", transactionId);

            TransferResponse response = new TransferResponse();
            response.setTransactionId(transactionId);
            response.setStatus("SUCCESS");
            response.setMessage("Transfer completed successfully");
            response.setDebitedFrom(request.getFromAccountId());
            response.setCreditedTo(request.getToAccountId());
            response.setAmount(request.getAmount());

            return response;

        } catch (Exception e) {
            UUID transactionId = UUID.randomUUID();
            TransactionLog failedLog = createTransactionLog(
                    transactionId,
                    request,
                    TransactionStatus.FAILED,
                    e.getMessage()
            );
            transactionLogRepository.save(failedLog);

            log.error("Transfer failed: {}", e.getMessage());
            throw e;
        }
    }

    private void validateTransfer(TransferRequest request) {
        if (request.getFromAccountId().equals(request.getToAccountId())) {
            throw new InvalidTransferException(
                    "Cannot transfer to the same account. Source and destination must be different."
            );
        }

        if (request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new InvalidTransferException("Transfer amount must be greater than zero");
        }
    }

    private void checkDuplicate(String idempotencyKey) {
        if (transactionLogRepository.existsByIdempotencyKey(idempotencyKey)) {
            throw new DuplicateTransferException(idempotencyKey);
        }
    }

    private TransactionLog createTransactionLog(
            UUID transactionId,
            TransferRequest request,
            TransactionStatus status,
            String failureReason
    ) {
        TransactionLog transactionLog = new TransactionLog();
        transactionLog.setId(transactionId);
        transactionLog.setFromAccountId(request.getFromAccountId());
        transactionLog.setToAccountId(request.getToAccountId());
        transactionLog.setAmount(request.getAmount());
        transactionLog.setStatus(status);
        transactionLog.setFailureReason(failureReason);

        return transactionLog;
    }
}

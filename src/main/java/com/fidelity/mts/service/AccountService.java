package com.fidelity.mts.service;

import com.fidelity.mts.dto.AccountResponse;
import com.fidelity.mts.dto.TransactionResponse;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {

    AccountResponse getAccount(Long accountId);

    BigDecimal getBalance(Long accountId);

    List<TransactionResponse> getTransactions(Long accountId);
}

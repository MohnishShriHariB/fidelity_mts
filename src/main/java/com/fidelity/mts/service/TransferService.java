package com.fidelity.mts.service;

import com.fidelity.mts.dto.TransferRequest;
import com.fidelity.mts.dto.TransferResponse;

public interface TransferService {

    /**
     * Execute a money transfer from one account to another.
     */
    TransferResponse transfer(TransferRequest request);
}

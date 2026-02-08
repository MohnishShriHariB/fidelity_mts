package com.fidelity.mts.controller;

import com.fidelity.mts.dto.TransferRequest;
import com.fidelity.mts.dto.TransferResponse;
import com.fidelity.mts.service.TransferService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transfers")
@CrossOrigin(origins = "*")
public class TransferController {
    
    private static final Logger log = LoggerFactory.getLogger(TransferController.class);
    
    private final TransferService transferService;
    
    @Autowired
    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }
   
    @PostMapping
    public ResponseEntity<TransferResponse> transfer(@Valid @RequestBody TransferRequest request) {
        log.info("Received transfer request: {}", request);
        
        TransferResponse response = transferService.transfer(request);
        
        return ResponseEntity.ok(response);
    }
    
    /**@GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Transfer API is running");
    }
    */
}
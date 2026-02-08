package com.fidelity.mts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main class to start the Spring Boot application.
 */
@SpringBootApplication
public class MoneyTransferSystemFidelityApplication 
{
    public static void main(String[] args) {
        SpringApplication.run(MoneyTransferSystemFidelityApplication.class, args);
        
        System.out.println("==============================================");
        System.out.println("Money Tranfer System is running!");
        System.out.println("API Base URL: http://localhost:8081/api/v1");
        System.out.println("Health Check: http://localhost:8081/api/v1/transfers/health");
        System.out.println("==============================================");
    }
}
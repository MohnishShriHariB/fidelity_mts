package com.fidelity.mts.dto;

import java.time.LocalDateTime;
import java.util.Objects;

public class ErrorResponse {
    
    private String errorCode;
    private String message;
    private LocalDateTime timestamp;
    private int status;
    
    public ErrorResponse() {
    }
    
    public ErrorResponse(String errorCode, String message, LocalDateTime timestamp, int status) {
        this.errorCode = errorCode;
        this.message = message;
        this.timestamp = timestamp;
        this.status = status;
    }
    
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public int getStatus() {
        return status;
    }
    
    public void setStatus(int status) {
        this.status = status;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ErrorResponse that = (ErrorResponse) o;
        return status == that.status &&
                Objects.equals(errorCode, that.errorCode) &&
                Objects.equals(message, that.message) &&
                Objects.equals(timestamp, that.timestamp);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(errorCode, message, timestamp, status);
    }
    
    @Override
    public String toString() {
        return "ErrorResponse{" +
                "errorCode='" + errorCode + '\'' +
                ", message='" + message + '\'' +
                ", timestamp=" + timestamp +
                ", status=" + status +
                '}';
    }
}

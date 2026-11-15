package com.fitlife.mfe.perfil.bff.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice(basePackages = "com.fitlife.mfe.perfil.bff")
public class BffExceptionHandler {
    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<Map<String, Object>> gateway(RestClientResponseException error) {
        return ResponseEntity.status(error.getStatusCode()).body(Map.of("status", error.getStatusCode().value(), "message", error.getResponseBodyAsString().isBlank() ? "O serviço recusou a solicitação." : error.getResponseBodyAsString()));
    }
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, Object>> unavailable(ResourceAccessException error) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("status", 503, "message", "Não foi possível alcançar o API Gateway ou o microsserviço."));
    }
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> status(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(Map.of("status", error.getStatusCode().value(), "message", error.getReason() == null ? "Solicitação não autorizada." : error.getReason()));
    }
}

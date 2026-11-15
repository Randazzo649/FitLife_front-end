package com.fitlife.mfe.cadastro.bff.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;

@RestControllerAdvice(basePackages = "com.fitlife.mfe.cadastro.bff")
public class BffExceptionHandler {
    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<Map<String, Object>> tratarRespostaDoGateway(RestClientResponseException erro) {
        return ResponseEntity.status(erro.getStatusCode()).body(Map.of(
                "status", erro.getStatusCode().value(),
                "message", "O API Gateway recusou a solicitação de cadastro."
        ));
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, Object>> tratarIndisponibilidade(ResourceAccessException erro) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "status", HttpStatus.SERVICE_UNAVAILABLE.value(),
                "message", "Não foi possível alcançar o API Gateway."
        ));
    }
}

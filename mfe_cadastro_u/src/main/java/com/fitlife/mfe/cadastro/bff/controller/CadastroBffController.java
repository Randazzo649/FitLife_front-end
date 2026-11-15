package com.fitlife.mfe.cadastro.bff.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fitlife.mfe.cadastro.bff.service.CadastroBffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bff/usuarios")
public class CadastroBffController {
    private final CadastroBffService cadastroBffService;

    public CadastroBffController(CadastroBffService cadastroBffService) {
        this.cadastroBffService = cadastroBffService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<JsonNode> cadastrar(@RequestBody JsonNode dados) {
        JsonNode resposta = cadastroBffService.cadastrar(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}

package com.fitlife.mfe.perfil.bff.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fitlife.mfe.perfil.bff.client.ApiGatewayClient;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoBffService {
    private final ApiGatewayClient gateway;

    public AutenticacaoBffService(ApiGatewayClient gateway) {
        this.gateway = gateway;
    }

    public JsonNode autenticar(Map<String, Object> credenciais) {
        return gateway.postPublic("/api/usuarios/login", credenciais);
    }
}

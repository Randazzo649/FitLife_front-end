package com.fitlife.mfe.cadastro.bff.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fitlife.mfe.cadastro.bff.client.ApiGatewayClient;
import org.springframework.stereotype.Service;

@Service
public class CadastroBffService {
    private final ApiGatewayClient gatewayClient;
    private final ObjectMapper objectMapper;

    public CadastroBffService(ApiGatewayClient gatewayClient, ObjectMapper objectMapper) {
        this.gatewayClient = gatewayClient;
        this.objectMapper = objectMapper;
    }

    public JsonNode cadastrar(JsonNode dadosFormulario) {
        ObjectNode dadosGateway = objectMapper.createObjectNode();
        dadosFormulario.fields().forEachRemaining(campo -> dadosGateway.set(campo.getKey(), campo.getValue()));

        // O modelo Usuario enviado no projeto do microsserviço usa data_nasc.
        if (dadosFormulario.has("nascimento")) {
            String nascimento = dadosFormulario.get("nascimento").asText();
            if (nascimento.matches("\\d{2}/\\d{2}/\\d{4}")) {
                java.time.LocalDate data = java.time.LocalDate.parse(nascimento,
                        java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                dadosGateway.put("data_nasc", data.toString());
            } else {
                dadosGateway.put("data_nasc", nascimento);
            }
            dadosGateway.remove("nascimento");
        }

        return gatewayClient.post("/api/usuarios/cadastro", dadosGateway);
    }
}

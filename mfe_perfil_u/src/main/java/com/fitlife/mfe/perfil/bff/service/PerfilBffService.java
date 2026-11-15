package com.fitlife.mfe.perfil.bff.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fitlife.mfe.perfil.bff.client.ApiGatewayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PerfilBffService {
    private final ApiGatewayClient gateway;
    private final String gatewayUrl;

    public PerfilBffService(ApiGatewayClient gateway,
                            @Value("${fitlife.gateway.base-url}") String gatewayUrl) {
        this.gateway = gateway;
        this.gatewayUrl = gatewayUrl.replaceAll("/$", "");
    }

    public JsonNode buscar(String id, String token) {
        return ajustarFotoUrl(gateway.exchange("/api/usuarios/" + id, HttpMethod.GET, null, token));
    }

    public JsonNode atualizar(String id, JsonNode dados, String token) {
        return ajustarFotoUrl(gateway.exchange("/api/usuarios/" + id, HttpMethod.PUT, dados, token));
    }

    public JsonNode atualizarMedico(String id, JsonNode dados, String token) {
        return gateway.exchange("/api/usuarios/" + id + "/informacoes-medicas", HttpMethod.PUT, dados, token);
    }

    public JsonNode foto(String id, MultipartFile file, String token) throws java.io.IOException {
        return ajustarFotoUrl(gateway.upload("/api/usuarios/" + id + "/foto", file, token));
    }

    private JsonNode ajustarFotoUrl(JsonNode resposta) {
        if (resposta instanceof ObjectNode objeto && objeto.path("fotoUrl").isTextual()) {
            String caminho = objeto.path("fotoUrl").asText();
            if (!caminho.startsWith("http://") && !caminho.startsWith("https://")) {
                objeto.put("fotoUrl", gatewayUrl + (caminho.startsWith("/") ? caminho : "/" + caminho));
            }
        }
        return resposta;
    }
}

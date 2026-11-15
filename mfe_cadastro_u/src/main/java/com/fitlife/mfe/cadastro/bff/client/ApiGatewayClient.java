package com.fitlife.mfe.cadastro.bff.client;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ApiGatewayClient {
    private final RestClient restClient;

    public ApiGatewayClient(RestClient.Builder builder,
                            @Value("${fitlife.gateway.base-url}") String gatewayUrl) {
        this.restClient = builder.baseUrl(gatewayUrl).build();
    }

    public JsonNode post(String path, Object body) {
        return restClient.post()
                .uri(path)
                .body(body)
                .retrieve()
                .body(JsonNode.class);
    }
}

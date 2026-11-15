package com.fitlife.mfe.personal.bff.client;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ApiGatewayClient {
    private final RestClient client;

    public ApiGatewayClient(RestClient.Builder builder,
                            @Value("${fitlife.gateway.base-url}") String baseUrl) {
        this.client = builder.baseUrl(baseUrl).build();
    }

    public JsonNode exchange(String path, HttpMethod method, Object body, String jwt) {
        var request = client.method(method).uri(path).headers(headers -> {
            headers.set("X-FitLife-Client", "mfe_personal_u");
            if (jwt != null && !jwt.isBlank()) headers.setBearerAuth(jwt);
        });
        if (body != null) request.body(body);
        ResponseEntity<JsonNode> response = request.retrieve().toEntity(JsonNode.class);
        return response.getBody();
    }
}

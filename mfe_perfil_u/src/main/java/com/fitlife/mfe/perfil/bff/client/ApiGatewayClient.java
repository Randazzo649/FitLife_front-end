package com.fitlife.mfe.perfil.bff.client;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ApiGatewayClient {
    private final RestClient client;

    public ApiGatewayClient(RestClient.Builder builder, @Value("${fitlife.gateway.base-url}") String baseUrl) {
        this.client = builder.baseUrl(baseUrl).build();
    }

    public JsonNode postPublic(String path, Object body) {
        return client.post().uri(path).body(body).retrieve().body(JsonNode.class);
    }

    public JsonNode exchange(String path, HttpMethod method, Object body, String jwt) {
        var request = client.method(method).uri(path).headers(headers -> {
            headers.set("X-FitLife-Client", "mfe_perfil_u");
            if (jwt != null && !jwt.isBlank()) headers.setBearerAuth(jwt);
        });
        if (body != null) request.body(body);
        ResponseEntity<JsonNode> response = request.retrieve().toEntity(JsonNode.class);
        return response.getBody();
    }

    public JsonNode upload(String path, MultipartFile file, String jwt) throws java.io.IOException {
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override public String getFilename() { return file.getOriginalFilename() == null ? "arquivo" : file.getOriginalFilename(); }
        };
        HttpHeaders partHeaders = new HttpHeaders();
        if (file.getContentType() != null) partHeaders.setContentType(MediaType.parseMediaType(file.getContentType()));
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("foto", new HttpEntity<>(resource, partHeaders));
        return client.put().uri(path).headers(headers -> headers.setBearerAuth(jwt))
                .contentType(MediaType.MULTIPART_FORM_DATA).body(parts).retrieve().body(JsonNode.class);
    }
}

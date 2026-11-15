package com.fitlife.mfe.personal.bff.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthCookieService {
    private final ObjectMapper mapper;
    public AuthCookieService(ObjectMapper mapper) { this.mapper = mapper; }
    public String exigirToken(String token) {
        if (token == null || token.isBlank()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão expirada. Entre novamente.");
        return token;
    }
    public String usuarioId(String token) {
        exigirToken(token);
        try {
            String[] partes = token.split("\\.");
            if (partes.length != 3) throw new IllegalArgumentException("JWT inválido");
            JsonNode claims = mapper.readTree(Base64.getUrlDecoder().decode(partes[1]));
            JsonNode id = claims.hasNonNull("usuarioId") ? claims.get("usuarioId") : claims.get("sub");
            if (id == null || id.asText().isBlank()) throw new IllegalArgumentException("JWT sem identificador");
            return id.asText();
        } catch (Exception error) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida. Entre novamente.");
        }
    }
}

package com.fitlife.mfe.perfil.bff.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fitlife.mfe.perfil.bff.service.AutenticacaoBffService;
import com.fitlife.mfe.perfil.bff.service.AuthCookieService;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bff/autenticacao")
public class AutenticacaoBffController {
    private final AutenticacaoBffService service; private final AuthCookieService auth;
    private final String cookieName, cookieDomain, sameSite; private final boolean secure;
    public AutenticacaoBffController(AutenticacaoBffService service, AuthCookieService auth,
        @Value("${fitlife.auth.cookie-name:FITLIFE_AUTH}") String cookieName,
        @Value("${fitlife.auth.cookie-domain:}") String cookieDomain,
        @Value("${fitlife.auth.cookie-same-site:Lax}") String sameSite,
        @Value("${fitlife.auth.cookie-secure:false}") boolean secure) {
        this.service=service; this.auth=auth; this.cookieName=cookieName; this.cookieDomain=cookieDomain; this.sameSite=sameSite; this.secure=secure;
    }
    @PostMapping("/login") public ResponseEntity<Map<String,Object>> login(@RequestBody Map<String,Object> dados) {
        JsonNode result=service.autenticar(dados);
        String token=result.path("accessToken").asText(result.path("token").asText(""));
        if(token.isBlank()) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_GATEWAY,"O serviço de usuários não retornou token.");
        JsonNode usuario=result.path("usuario");
        ResponseCookie cookie=buildCookie(token,Duration.ofHours(8));
        Map<String,Object> body=new LinkedHashMap<>(); body.put("authenticated",true); body.put("usuarioId",usuario.path("id").asText(result.path("usuarioId").asText(""))); body.put("nome",usuario.path("nome").asText(""));
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,cookie.toString()).body(body);
    }
    @PostMapping("/logout") public ResponseEntity<Map<String,Object>> logout() { return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,buildCookie("",Duration.ZERO).toString()).body(Map.of("authenticated",false)); }
    @GetMapping("/sessao") public Map<String,Object> sessao(@CookieValue(value="FITLIFE_AUTH",required=false) String token) {
        if(token==null||token.isBlank()) return Map.of("authenticated",false);
        try { return Map.of("authenticated",true,"usuarioId",auth.usuarioId(token)); } catch(Exception e) { return Map.of("authenticated",false); }
    }
    private ResponseCookie buildCookie(String value,Duration age) { ResponseCookie.ResponseCookieBuilder b=ResponseCookie.from(cookieName,value).httpOnly(true).secure(secure).sameSite(sameSite).path("/").maxAge(age); if(cookieDomain!=null&&!cookieDomain.isBlank())b.domain(cookieDomain); return b.build(); }
}

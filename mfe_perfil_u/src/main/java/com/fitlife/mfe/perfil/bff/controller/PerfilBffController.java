package com.fitlife.mfe.perfil.bff.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fitlife.mfe.perfil.bff.service.AuthCookieService;
import com.fitlife.mfe.perfil.bff.service.PerfilBffService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/bff/usuarios/me")
public class PerfilBffController {
    private final PerfilBffService service; private final AuthCookieService auth;
    public PerfilBffController(PerfilBffService service,AuthCookieService auth){this.service=service;this.auth=auth;}
    @GetMapping public JsonNode buscar(@CookieValue(value="FITLIFE_AUTH",required=false) String token){return service.buscar(auth.usuarioId(token),token);}
    @PutMapping public JsonNode atualizar(@RequestBody JsonNode dados,@CookieValue(value="FITLIFE_AUTH",required=false) String token){return service.atualizar(auth.usuarioId(token),dados,token);}
    @PutMapping("/informacoes-medicas") public JsonNode atualizarMedico(@RequestBody JsonNode dados,@CookieValue(value="FITLIFE_AUTH",required=false) String token){return service.atualizarMedico(auth.usuarioId(token),dados,token);}
    @PutMapping(value="/foto",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public JsonNode foto(@RequestPart("foto") MultipartFile foto,@CookieValue(value="FITLIFE_AUTH",required=false) String token)throws java.io.IOException{return service.foto(auth.usuarioId(token),foto,token);}
}

package com.fitlife.mfe.treinos.bff.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fitlife.mfe.treinos.bff.service.AuthCookieService;
import com.fitlife.mfe.treinos.bff.service.TreinosBffService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/bff")
public class TreinosBffController {
 private final TreinosBffService service; private final AuthCookieService auth;
 public TreinosBffController(TreinosBffService s,AuthCookieService a){service=s;auth=a;}
 @GetMapping("/usuario/me") public JsonNode usuario(@CookieValue(value="FITLIFE_AUTH",required=false)String token){return service.usuario(auth.usuarioId(token),token);}
 @GetMapping("/treinos") public JsonNode listar(@CookieValue(value="FITLIFE_AUTH",required=false)String token){return service.listar(auth.usuarioId(token),token);}
 @PutMapping("/treinos") public JsonNode salvar(@RequestBody JsonNode treinos,@CookieValue(value="FITLIFE_AUTH",required=false)String token){return service.salvar(auth.usuarioId(token),treinos,token);}
 @PostMapping("/treinos") public JsonNode criar(@RequestBody JsonNode treino,@CookieValue(value="FITLIFE_AUTH",required=false)String token){return service.criar(auth.usuarioId(token),treino,token);}
}

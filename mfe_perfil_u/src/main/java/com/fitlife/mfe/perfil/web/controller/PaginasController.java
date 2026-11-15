package com.fitlife.mfe.perfil.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CookieValue;

@Controller
public class PaginasController {
    private final String shell,treinos,personal,comunidade;
    public PaginasController(@Value("${fitlife.urls.shell}")String shell,@Value("${fitlife.urls.treinos}")String treinos,@Value("${fitlife.urls.personal}")String personal,@Value("${fitlife.urls.comunidade}")String comunidade){this.shell=shell;this.treinos=treinos;this.personal=personal;this.comunidade=comunidade;}
    @GetMapping({"/","/perfil"}) public String perfil(@CookieValue(value="FITLIFE_AUTH",required=false)String token,Model model){if(!auth(token))return "redirect:"+shell;links(model);return "perfil";}
    @GetMapping("/editar-perfil") public String editar(@CookieValue(value="FITLIFE_AUTH",required=false)String token,Model model){if(!auth(token))return "redirect:"+shell;links(model);return "editar-perfil";}
    @GetMapping("/atualizar-informacoes") public String informacoes(@CookieValue(value="FITLIFE_AUTH",required=false)String token,Model model){if(!auth(token))return "redirect:"+shell;links(model);return "atualizar-informacoes";}
    private boolean auth(String token){return token!=null&&!token.isBlank();}
    private void links(Model m){m.addAttribute("shellUrl",shell);m.addAttribute("perfilUrl","/perfil");m.addAttribute("treinosUrl",treinos+"/");m.addAttribute("personalUrl",personal+"/");m.addAttribute("comunidadeUrl",comunidade);}
}

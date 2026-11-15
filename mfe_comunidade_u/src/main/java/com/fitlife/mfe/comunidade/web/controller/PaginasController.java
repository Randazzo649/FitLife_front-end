package com.fitlife.mfe.comunidade.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginasController {
    private final String shell;
    private final String perfil;

    public PaginasController(@Value("${fitlife.urls.shell}") String shell,
                             @Value("${fitlife.urls.perfil}") String perfil) {
        this.shell = shell;
        this.perfil = perfil;
    }

    @GetMapping({"/", "/comunidade"})
    public String comunidade(@CookieValue(value = "FITLIFE_AUTH", required = false) String token, Model model) {
        if (token == null || token.isBlank()) return "redirect:" + shell;
        links(model);
        return "comunidade";
    }

    @GetMapping("/eventos")
    public String eventos(@CookieValue(value = "FITLIFE_AUTH", required = false) String token, Model model) {
        if (token == null || token.isBlank()) return "redirect:" + shell;
        links(model);
        return "eventos";
    }

    private void links(Model model) {
        model.addAttribute("shellUrl", shell);
        model.addAttribute("perfilUrl", perfil + "/perfil");
    }
}

package com.fitlife.mfe.cadastro.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginasController {
    private final String shellUrl;
    public PaginasController(@Value("${fitlife.urls.shell}") String shellUrl) { this.shellUrl = shellUrl; }
    @GetMapping({"/", "/cadastro"})
    public String cadastro(Model model) { model.addAttribute("shellUrl", shellUrl); return "cadastro"; }
}

package com.fitlife.mfe.perfil.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration public class CorsConfig implements WebMvcConfigurer {
  private final String origin; public CorsConfig(@Value("${fitlife.cors.shell-origin}") String origin){this.origin=origin;}
  @Override public void addCorsMappings(CorsRegistry r){r.addMapping("/bff/autenticacao/**").allowedOrigins(origin).allowedMethods("GET","POST","OPTIONS").allowedHeaders("Content-Type","Accept").allowCredentials(true).maxAge(3600);}
}

/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class ConfigSecurity {

  /**
   * That security chain will be used by the RestAPI part of the application It therefor does need
   * to be authenticated using the JWT token provided by OpenID
   *
   * @param http injected security object
   * @return the API SecurityFilterChain
   * @throws Exception -
   */
  @Bean
  public SecurityFilterChain resourceServerFilterChain(HttpSecurity http) throws Exception {
    /*return http
    // Restrict to all path prefixed with /api
    .securityMatcher("/api/**")
    .authorizeHttpRequests(authorizeRequests -> authorizeRequests.anyRequest().authenticated())
    // Disable CSRF and set session Stateless for performance reasons
    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .csrf(AbstractHttpConfigurer::disable)
    .exceptionHandling(
        handeling ->
            handeling.authenticationEntryPoint(
                (request, response, authException) -> {
                  response.addHeader(HttpHeaders.WWW_AUTHENTICATE, "Restricted Content");
                  response.sendError(
                      HttpStatus.UNAUTHORIZED.value(),
                      HttpStatus.UNAUTHORIZED.getReasonPhrase());
                }))
    .oauth2ResourceServer(resourceServer -> resourceServer.jwt(Customizer.withDefaults()))
    .build();*/
    return http.authorizeHttpRequests(
            authorizeRequests -> authorizeRequests.anyRequest().permitAll())
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .build();
  }

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry
            .addMapping("/api/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH");
      }
    };
  }
}

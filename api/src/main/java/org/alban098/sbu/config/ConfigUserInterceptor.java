/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.config;

import org.alban098.sbu.interceptor.UserHandlingInterceptor;
import org.alban098.sbu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfigUserInterceptor implements WebMvcConfigurer {

  @Autowired private UserRepository userRepository;
  private final String contextPath;

  public ConfigUserInterceptor(
      UserRepository userRepository, @Value("${server.servlet.context-path:}") String contextPath) {
    this.userRepository = userRepository;
    this.contextPath = contextPath;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry
        .addInterceptor(new UserHandlingInterceptor(userRepository, contextPath))
        .addPathPatterns("/**");
  }
}

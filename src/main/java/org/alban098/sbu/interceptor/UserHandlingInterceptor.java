/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;
import org.alban098.sbu.entity.User;
import org.alban098.sbu.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.ClaimAccessor;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.web.servlet.HandlerInterceptor;

/** This interceptor in responsible for creating User Account when a new OpenID Subject connect */
public class UserHandlingInterceptor implements HandlerInterceptor {

  private final UserRepository repository;

  public UserHandlingInterceptor(UserRepository repository) {
    this.repository = repository;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    // Only OIDC or JWT authentication, so this is safe
    ClaimAccessor oidcUser = (ClaimAccessor) auth.getPrincipal();
    String subjectId = oidcUser.getClaimAsString(IdTokenClaimNames.SUB);
    Optional<User> userOptional = repository.findByOicdId(subjectId);
    // If this is a new OpenId User, we create an internal user linked to that Subject ID
    if (userOptional.isEmpty()) {
      User newUser = new User(oidcUser.getClaimAsString("name"), subjectId);
      repository.save(newUser);
    }
    return true;
  }
}

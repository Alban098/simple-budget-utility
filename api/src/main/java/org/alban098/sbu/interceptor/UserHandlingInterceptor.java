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
import java.io.IOException;
import java.util.Optional;
import org.alban098.sbu.entity.User;
import org.alban098.sbu.repository.UserRepository;
import org.alban098.sbu.utils.ForbiddenException;
import org.hibernate.SessionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.ClaimAccessor;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.web.servlet.HandlerInterceptor;

/** This interceptor in responsible for creating User Account when a new OpenID Subject connect */
public class UserHandlingInterceptor implements HandlerInterceptor {

  private final UserRepository repository;
  private final SessionFactory sessionFactory;
  private final String contextPath;

  public UserHandlingInterceptor(
      UserRepository repository, SessionFactory sessionFactory, String contextPath) {
    this.repository = repository;
    this.sessionFactory = sessionFactory;
    this.contextPath = contextPath;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) {
    // Bypass the user handling routine when requesting the react frontend
    if (!isApi(request)) {
      return true;
    }
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    // Only OIDC or JWT authentication, so this is safe
    ClaimAccessor oidcUser = (ClaimAccessor) auth.getPrincipal();
    String subjectId = oidcUser.getClaimAsString(IdTokenClaimNames.SUB);
    Optional<User> userOptional = repository.findByOicdId(subjectId);
    if (userOptional.isEmpty()) {
      try {
        response.sendError(
            HttpServletResponse.SC_FORBIDDEN,
            "No account exists for OICD user '"
                + oidcUser.getClaimAsString(IdTokenClaimNames.SUB)
                + "', please use 'POST @/api/user/create' to create it");
        return false;
      } catch (IOException e) {
        throw new ForbiddenException(e.getMessage());
      }
    }
    return true;
  }

  private boolean isApi(HttpServletRequest request) {
    return request.getRequestURI().startsWith(contextPath + "/api");
  }
}

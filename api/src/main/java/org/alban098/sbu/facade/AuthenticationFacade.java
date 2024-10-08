/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.facade;

import lombok.AllArgsConstructor;
import org.alban098.sbu.entity.User;
import org.alban098.sbu.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.ClaimAccessor;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AuthenticationFacade implements IAuthenticationFacade {

  private UserRepository userRepository;

  public User getCurrentUser() {
    ClaimAccessor oidcUser = (ClaimAccessor) getAuthentication().getPrincipal();
    return userRepository
        .findByOicdId(oidcUser.getClaimAsString(IdTokenClaimNames.SUB))
        .orElse(null);
  }

  @Override
  public Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }
}

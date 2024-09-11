/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import lombok.AllArgsConstructor;
import org.alban098.sbu.entity.User;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.repository.UserRepository;
import org.alban098.sbu.utils.ForbiddenException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final IAuthenticationFacade authenticationFacade;

  public User getUser() {
    return authenticationFacade.getCurrentUser();
  }

  public User getUser(final String subjectId) {
    return userRepository.findByOicdId(subjectId).orElseThrow(ForbiddenException::new);
  }
}

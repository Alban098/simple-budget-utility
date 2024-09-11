/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.facade;

import org.alban098.sbu.entity.User;
import org.springframework.security.core.Authentication;

public interface IAuthenticationFacade {
  User getCurrentUser();

  Authentication getAuthentication();
}

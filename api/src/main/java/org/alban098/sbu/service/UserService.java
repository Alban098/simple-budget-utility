/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import java.util.*;
import lombok.AllArgsConstructor;
import org.alban098.sbu.dto.UserDto;
import org.alban098.sbu.entity.User;
import org.alban098.sbu.repository.UserRepository;
import org.alban098.sbu.utils.ForbiddenException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

  private final UserRepository accountRepository;
  private final UserRepository userRepository;

  public User create(UserDto dto) {
    Optional<User> existing = userRepository.findByOicdId(dto.getOicdId());
    if (existing.isPresent()) {
      throw new ForbiddenException("user with that oicd id already exists");
    }
    User user = new User();
    user.setOicdId(dto.getOicdId());
    user.setUsername(dto.getUsername());
    return accountRepository.save(user);
  }
}

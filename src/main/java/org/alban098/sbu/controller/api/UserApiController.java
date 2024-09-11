/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller.api;

import org.alban098.sbu.controller.AbstractController;
import org.alban098.sbu.dto.UserDto;
import org.alban098.sbu.entity.User;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserApiController extends AbstractController<User> {

  private final UserService userService;

  public UserApiController(IAuthenticationFacade authenticationFacade, UserService userService) {
    super(authenticationFacade);
    this.userService = userService;
  }

  @GetMapping("/")
  public ResponseEntity<User> index() {
    User user = userService.getUser();
    return ResponseEntity.ok().build();
  }

  @Override
  protected UserDto createDto(User entity) {
    return null;
  }
}

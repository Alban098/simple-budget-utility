/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller;

import org.alban098.sbu.dto.UserDto;
import org.alban098.sbu.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/create")
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity<UserDto> create(@RequestBody UserDto userDto) {
    userService.create(userDto);
    return ResponseEntity.ok().build();
  }
}

/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.dto;

import lombok.Getter;
import lombok.Setter;
import org.alban098.sbu.entity.User;

@Getter
@Setter
public class UserDto implements Dto<User> {

  private String id;
  private String username;
  private String oicdId;

  @Override
  public boolean validate() {
    return true;
  }
}

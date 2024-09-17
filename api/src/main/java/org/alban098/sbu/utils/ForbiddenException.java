/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.utils;

public class ForbiddenException extends RuntimeException {

  public ForbiddenException() {
    super();
  }

  public ForbiddenException(String message) {
    super(message);
  }
}

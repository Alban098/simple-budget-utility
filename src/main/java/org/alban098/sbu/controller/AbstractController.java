/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller;

import java.util.ArrayList;
import java.util.Collection;
import org.alban098.sbu.dto.Dto;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.utils.ForbiddenException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public abstract class AbstractController<T> {

  protected final IAuthenticationFacade authenticationFacade;

  public AbstractController(IAuthenticationFacade authenticationFacade) {
    this.authenticationFacade = authenticationFacade;
  }

  protected <O extends Dto<T>> Collection<O> createDtos(Iterable<T> entities) {
    Collection<O> dtos = new ArrayList<>();
    for (T entity : entities) {
      dtos.add(createDto(entity));
    }
    return dtos;
  }

  protected abstract <O extends Dto<T>> O createDto(T entity);

  @ResponseStatus(
      value = HttpStatus.FORBIDDEN,
      reason = "Not allowed to access this resource") // 403
  @ExceptionHandler(ForbiddenException.class)
  protected final void forbidden() {
    // Nothing to do
  }
}

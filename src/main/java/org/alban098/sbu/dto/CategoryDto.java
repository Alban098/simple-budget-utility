/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.dto;

import lombok.*;
import org.alban098.sbu.entity.Category;

@Getter
@Setter
public class CategoryDto implements Dto<Category> {

  private String id;
  private String name;
  private Double expense;

  @Override
  public boolean validate() {
    return true;
  }
}

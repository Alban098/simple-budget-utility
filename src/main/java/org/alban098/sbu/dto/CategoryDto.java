/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.dto;

import lombok.*;

@Getter
@Setter
public class CategoryDto {

  private String id;
  private String name;
  private Double expense;
}

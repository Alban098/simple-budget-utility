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

@Getter
@Setter
public class DataLineDto {

  private String label;
  private DataValueDto[] data;
}

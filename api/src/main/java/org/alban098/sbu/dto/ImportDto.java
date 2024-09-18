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
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ImportDto {

  private String account;
  private String bank;
  private MultipartFile file;
}

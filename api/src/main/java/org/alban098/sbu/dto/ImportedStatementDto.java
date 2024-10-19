/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportedStatementDto {

  private String id;
  private String account;
  private LocalDate date;
  private String file;
  private int transactionCount;
  private LocalDate firstTransactionDate;
  private LocalDate lastTransactionDate;
}

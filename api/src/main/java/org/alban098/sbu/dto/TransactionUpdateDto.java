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
import org.alban098.sbu.utils.Currency;

@Getter
@Setter
public class TransactionUpdateDto {

  private String id;
  private CategoryDto category;
  private AccountDto account;
  private LocalDate date;
  private String description;
  private AmountDto amount;

  public void setAmount(Currency currency, double value) {
    amount = new AmountDto(value, currency);
  }
}

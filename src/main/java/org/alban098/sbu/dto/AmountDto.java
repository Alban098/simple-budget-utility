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
import org.alban098.sbu.utils.Currency;

@Getter
@Setter
public class AmountDto {

  private Double value;
  private Currency currency;

  public AmountDto(double value, Currency currency) {
    this.value = value;
    this.currency = currency;
  }
}

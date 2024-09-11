/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.utils;

import lombok.Getter;

@Getter
public enum Currency {
  EUR("€"),
  CHF("CHF"),
  US_DOLLAR("$");

  private final String symbol;

  Currency(String symbol) {
    this.symbol = symbol;
  }
}

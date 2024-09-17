/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import lombok.Getter;
import lombok.Setter;
import org.alban098.sbu.utils.Currency;

@Getter
@Setter
public class TransactionDto {

  private String id;
  private String category;
  private String account;
  private LocalDate date;
  private String description;
  private final Collection<AmountDto> amounts = new ArrayList<>(Currency.values().length);

  public TransactionDto() {
    for (Currency currency : Currency.values()) {
      amounts.add(new AmountDto(0, currency));
    }
  }

  public void setAmount(Currency currency, double value) {
    amounts.stream()
        .filter(b -> b.getCurrency().equals(currency))
        .findFirst()
        .ifPresent(b -> b.setValue(value));
  }
}

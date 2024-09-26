/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.dto;

import java.util.ArrayList;
import java.util.Collection;
import lombok.Getter;
import lombok.Setter;
import org.alban098.sbu.utils.Currency;

@Getter
@Setter
public class AccountDto {

  private String id;
  private String name;
  private String accountNumber;
  private String description;
  private final Collection<AmountDto> balances = new ArrayList<>(Currency.values().length);
  private AmountDto amount = new AmountDto(0, Currency.EUR);

  public AccountDto() {
    for (Currency currency : Currency.values()) {
      balances.add(new AmountDto(0, currency));
    }
  }

  public void setBalance(Currency currency, double value) {
    balances.stream()
        .filter(b -> b.getCurrency().equals(currency))
        .findFirst()
        .ifPresent(b -> b.setValue(value));
  }
}

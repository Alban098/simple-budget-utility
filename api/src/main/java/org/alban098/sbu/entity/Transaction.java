/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.alban098.sbu.utils.Currency;

@Getter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class Transaction implements Comparable<Transaction> {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Setter
  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
      optional = false,
      fetch = FetchType.EAGER)
  private Account account;

  @Setter
  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
      optional = true,
      fetch = FetchType.EAGER)
  private Category category;

  @Setter @Column private LocalDate date;

  @Setter @Column private String description;

  @Setter
  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  private Collection<Amount> amounts = new ArrayList<>();

  public Transaction(Account account, Category category, LocalDate date, String description) {
    this.account = account;
    this.category = category;
    this.date = date;
    this.description = description;
    for (Currency currency : Currency.values()) {
      amounts.add(new Amount(0d, currency));
    }
  }

  public void setAmount(Currency currency, double value) {
    if (amounts.stream().filter(b -> b.getCurrency().equals(currency)).findFirst().isEmpty()) {
      amounts.add(new Amount(value, currency));
    } else {
      amounts.stream()
          .filter(b -> b.getCurrency().equals(currency))
          .findFirst()
          .ifPresent(b -> b.setValue(value));
    }
    amounts.removeIf(b -> b.getValue() == 0);
  }

  @Override
  public int compareTo(Transaction o) {
    if (id.equals(o.id)) {
      return 0;
    }
    int result = date.compareTo(o.date);
    if (result == 0) {
      return id.compareTo(o.id);
    }
    return result;
  }
}

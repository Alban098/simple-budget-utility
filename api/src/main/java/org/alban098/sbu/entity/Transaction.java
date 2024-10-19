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
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.alban098.sbu.utils.Currency;

@Setter
@Getter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class Transaction implements Comparable<Transaction> {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
      optional = false,
      fetch = FetchType.EAGER)
  private Account account;

  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
      optional = true,
      fetch = FetchType.EAGER)
  private Category category;

  @Column private LocalDate date;

  @Column private String description;

  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
  private Amount amount;

  @Column private boolean isImported;

  public Transaction(Account account, Category category, LocalDate date, String description) {
    this.account = account;
    this.category = category;
    this.date = date;
    this.description = description;
    this.amount = new Amount(0d, Currency.EUR);
    this.isImported = false;
  }

  public void setAmount(Currency currency, double value) {
    amount = new Amount(value, currency);
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

  @Override
  public String toString() {
    return date.toString() + " " + description + " " + amount.toString();
  }
}

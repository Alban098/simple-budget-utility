/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.TreeSet;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class Account {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Setter @Column private String name;

  @Setter @Column private String description;

  @Setter
  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH},
      fetch = FetchType.EAGER,
      optional = false)
  private User user;

  @Setter
  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  private Collection<Amount> amounts = new ArrayList<>();

  @Setter
  @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private Amount amount;

  @OneToMany(
      cascade = CascadeType.ALL,
      fetch = FetchType.LAZY,
      orphanRemoval = true,
      mappedBy = "account")
  private final Collection<Transaction> transactions = new TreeSet<>();

  public Account(String name, String description) {
    this.name = name;
    this.description = description;
  }

  public void setTransactions(Collection<Transaction> transactions) {
    this.transactions.clear();
    this.transactions.addAll(transactions);
  }

  public void removeTransaction(Transaction transaction) {
    this.transactions.remove(transaction);
    transaction.setAccount(null);
  }

  public void removeTransactions(Collection<Transaction> transactions) {
    this.transactions.removeAll(transactions);
    transactions.forEach(t -> t.setAccount(null));
  }

  public void addTransaction(Transaction transaction) {
    this.transactions.add(transaction);
    transaction.setAccount(this);
  }

  public void addTransactions(Collection<Transaction> transactions) {
    this.transactions.addAll(transactions);
    transactions.forEach(t -> t.setAccount(this));
  }
}

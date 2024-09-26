/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.entity;

import jakarta.persistence.*;
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
  @Setter @Column private String accountNumber;
  @Setter @Column private String description;

  @Setter
  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH},
      fetch = FetchType.EAGER,
      optional = false)
  private User user;

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
}

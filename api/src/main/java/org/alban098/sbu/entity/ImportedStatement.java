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

@Getter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class ImportedStatement {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Setter
  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
      optional = false,
      fetch = FetchType.EAGER)
  private Account account;

  @Setter @Column private LocalDate date;
  @Setter @Column private String file;
  @Setter @Column private int transactionCount;
  @Setter @Column private LocalDate firstTransactionDate;
  @Setter @Column private LocalDate lastTransactionDate;
}

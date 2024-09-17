/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.alban098.sbu.utils.Currency;

@Getter
@Data
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class Amount {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Setter @Column private Double value;

  @Setter @Column private Currency currency;

  public Amount(Double value, Currency currency) {
    this.value = value;
    this.currency = currency;
  }
}

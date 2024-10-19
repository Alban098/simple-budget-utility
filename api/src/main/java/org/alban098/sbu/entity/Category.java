/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class Category {

  public static final Category UNCLASSIFIED = new Category("Unclassified", true);
  public static final Category RENT = new Category("Rent", false);
  public static final Category SALARY = new Category("Salary", false);
  public static final Category GROCERIES = new Category("Groceries", false);
  public static final Category CAR = new Category("Car", false);
  public static final Category FUEL = new Category("Fuel", false);
  public static final Category RESTAURANT = new Category("Restaurant", false);
  public static final Category TRANSFER = new Category("Transfer", true);
  public static final Category EXCHANGE = new Category("Exchange", true);
  public static final Category TOLL = new Category("Toll", false);
  public static final Category SUBSCRIPTION = new Category("Subscriptions", false);
  public static final Category INTERNET = new Category("Internet", false);
  public static final Category TAXES = new Category("Taxes", false);
  public static final Category ELECTRICITY = new Category("Electricity", false);
  public static final Category COMPUTER = new Category("Computer", false);
  public static final Category BIKE = new Category("Bike", false);
  public static final Category INSURANCE = new Category("Insurance", false);
  public static final Category ENTERTAINMENT = new Category("Entertainment", false);

  public static final Category[] DEFAULT_CATEGORIES =
      new Category[] {
        UNCLASSIFIED,
        RENT,
        SALARY,
        GROCERIES,
        CAR,
        FUEL,
        RESTAURANT,
        TRANSFER,
        EXCHANGE,
        TOLL,
        SUBSCRIPTION,
        INTERNET,
        TAXES,
        ELECTRICITY,
        COMPUTER,
        BIKE,
        INSURANCE,
        ENTERTAINMENT,
      };

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column private String name;

  @Column(nullable = false)
  private boolean ignored = false;

  public Category(String name, boolean ignored) {
    this.name = name;
    this.ignored = ignored;
  }
}

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
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Data
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class ClassificationRules implements Comparable<ClassificationRules> {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Setter @ManyToOne private Category category;

  @Setter
  @Column(nullable = false)
  private String regex;

  @Setter
  @Column(nullable = false)
  private int priority;

  public ClassificationRules(Category category, String regex, int priority) {
    this.category = category;
    this.regex = regex;
    this.priority = priority;
  }

  @Override
  public int compareTo(ClassificationRules o) {
    return Integer.compare(this.priority, o.priority);
  }
}

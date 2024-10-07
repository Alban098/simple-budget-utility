/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import java.util.List;
import lombok.AllArgsConstructor;
import org.alban098.sbu.entity.ClassificationRules;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.repository.ClassificationRuleRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClassificationService {

  private final ClassificationRuleRepository repository;

  public void tryClassifyTransactions(List<Transaction> transactions) {
    Iterable<ClassificationRules> rules = repository.findAllByPriority();
    for (Transaction transaction : transactions) {
      if (transaction.getDescription() == null) {
        continue;
      }
      for (ClassificationRules rule : rules) {
        if (transaction.getDescription().matches(rule.getRegex())) {
          transaction.setCategory(rule.getCategory());
          break;
        }
      }
    }
  }
}

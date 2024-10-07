/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.repository;

import org.alban098.sbu.entity.Category;
import org.alban098.sbu.entity.ClassificationRules;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ClassificationRuleRepository extends CrudRepository<Category, String> {

  @Query("select c from ClassificationRules c order by c.priority asc")
  Iterable<ClassificationRules> findAllByPriority();
}

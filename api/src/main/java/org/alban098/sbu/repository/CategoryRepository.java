/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.repository;

import java.util.List;
import java.util.Optional;
import org.alban098.sbu.entity.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface CategoryRepository extends CrudRepository<Category, String> {
  @Query("select c from Category c order by c.name")
  List<Category> findAllByNameAsc();

  @Query("select c from Category c where c.name = ?1 order by c.name LIMIT 1")
  Optional<Category> getFirstByName(String name);
}

/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.loader;

import java.util.Optional;
import lombok.AllArgsConstructor;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class CategoryDataLoader implements CommandLineRunner {

  private final CategoryRepository categoryRepository;

  @Override
  public void run(String... args) {
    for (Category category : Category.DEFAULT_CATEGORIES) {
      Optional<Category> opt = categoryRepository.getFirstByName(category.getName());
      if (opt.isEmpty()) {
        categoryRepository.save(category);
      } else {
        category.setId(opt.get().getId());
      }
    }
  }
}

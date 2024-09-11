/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import lombok.AllArgsConstructor;
import org.alban098.sbu.dto.CategoryDto;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.repository.CategoryRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;

  public Iterable<Category> getCategories() {
    return categoryRepository.findAll();
  }

  public Category getCategory(final String id) {
    return categoryRepository.findById(id).orElse(null);
  }

  public Category create(CategoryDto accountDto) {
    Category category = new Category();
    category.setName(accountDto.getName());
    return categoryRepository.save(category);
  }
}

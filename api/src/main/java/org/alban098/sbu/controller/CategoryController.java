/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller;

import java.net.URI;
import java.net.URISyntaxException;
import org.alban098.sbu.dto.CategoryDto;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping("/")
  public ResponseEntity<Iterable<CategoryDto>> list() {
    Iterable<Category> categories = categoryService.getCategories();
    return ResponseEntity.ok(categoryService.createDtos(categories));
  }

  @GetMapping("/{id}")
  public ResponseEntity<CategoryDto> show(@PathVariable String id) {
    Category category = categoryService.getCategory(id);
    return ResponseEntity.ok(categoryService.createDto(category));
  }

  @PostMapping("/")
  public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto categoryDto)
      throws URISyntaxException {
    Category category = categoryService.create(categoryDto);
    return ResponseEntity.created(new URI("/api/category/" + category.getId()))
        .body(categoryService.createDto(category));
  }
}

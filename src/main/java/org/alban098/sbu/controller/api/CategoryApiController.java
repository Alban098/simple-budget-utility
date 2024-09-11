/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller.api;

import java.net.URI;
import java.net.URISyntaxException;
import org.alban098.sbu.controller.AbstractController;
import org.alban098.sbu.dto.CategoryDto;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
public class CategoryApiController extends AbstractController<Category> {

  private final CategoryService categoryService;

  public CategoryApiController(
      IAuthenticationFacade authenticationFacade, CategoryService categoryService) {
    super(authenticationFacade);
    this.categoryService = categoryService;
  }

  @GetMapping("/")
  public ResponseEntity<Iterable<CategoryDto>> index() {
    Iterable<Category> categories = categoryService.getCategories();
    return ResponseEntity.ok(createDtos(categories));
  }

  @GetMapping("/{id}")
  public ResponseEntity<CategoryDto> show(@PathVariable String id) {
    Category category = categoryService.getCategory(id);
    return ResponseEntity.ok(createDto(category));
  }

  @PostMapping("/")
  public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto categoryDto)
      throws URISyntaxException {
    Category category = categoryService.create(categoryDto);
    return ResponseEntity.created(new URI("/api/category/" + category.getId()))
        .body(createDto(category));
  }

  @Override
  protected CategoryDto createDto(Category entity) {
    CategoryDto dto = new CategoryDto();
    dto.setId(entity.getId());
    dto.setName(entity.getName());
    return dto;
  }
}

/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller.api;

import java.time.Month;
import java.time.Year;
import java.time.format.TextStyle;
import java.util.*;
import org.alban098.sbu.dto.DataLineDto;
import org.alban098.sbu.dto.DataValueDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.service.AccountService;
import org.alban098.sbu.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis/")
public class AnalysisController {

  private final CategoryService categoryService;
  private final AccountService accountService;

  public AnalysisController(CategoryService categoryService, AccountService accountService) {
    this.categoryService = categoryService;
    this.accountService = accountService;
  }

  @GetMapping("/category")
  public ResponseEntity<Collection<DataValueDto>> analysis(
      @RequestParam(required = false) String accountId) {
    Iterable<Category> categories = categoryService.getCategories();
    Collection<DataValueDto> dtos = createDtos(categories);
    dtos.forEach(dto -> dto.setValue(Math.random() * 50000));
    return ResponseEntity.ok(dtos);
  }

  @GetMapping("/category/yearly")
  public ResponseEntity<Collection<DataValueDto>> yearlyAnalysis(
      @RequestParam(required = false) String accountId, @RequestParam int year) {
    Iterable<Category> categories = categoryService.getCategories();
    Collection<DataValueDto> dtos = createDtos(categories);
    dtos.forEach(dto -> dto.setValue(Math.random() * 5000));
    return ResponseEntity.ok(dtos);
  }

  @GetMapping("/category/yearly/month")
  public ResponseEntity<Collection<Collection<DataValueDto>>> yearlyMonthAnalysis(
      @RequestParam(required = false) String accountId, @RequestParam int year) {
    List<Collection<DataValueDto>> response = new ArrayList<>(12);
    for (Month month : Month.values()) {
      Iterable<Category> categories = categoryService.getCategories();
      Collection<DataValueDto> dtos = createDtos(categories);
      dtos.forEach(dto -> dto.setValue(Math.random() * 5000));
      response.add(dtos);
    }
    return ResponseEntity.ok(response);
  }

  @GetMapping("/category/monthly")
  public ResponseEntity<Collection<DataValueDto>> monthlyAnalysis(
      @RequestParam(required = false) String accountId,
      @RequestParam int month,
      @RequestParam int year) {
    Iterable<Category> categories = categoryService.getCategories();
    Collection<DataValueDto> dtos = createDtos(categories);
    dtos.forEach(dto -> dto.setValue(Math.random() * 500));
    return ResponseEntity.ok(dtos);
  }

  @GetMapping("/summary/netWorth/yearly")
  public ResponseEntity<Collection<DataLineDto>> netWorthYearlyAnalysis(
      @RequestParam(required = false) String accountId, @RequestParam int year) {
    Collection<DataLineDto> response = new ArrayList<>();
    List<DataValueDto> total = new ArrayList<>(Year.of(year).length() / 7);
    Page<Account> accounts = accountService.getAccountsOfUser();
    for (Account account : accounts) {
      double runningTotal = 0;
      DataLineDto dto = new DataLineDto();
      dto.setLabel(account.getName());
      DataValueDto[] data = new DataValueDto[Year.of(year).length() / 7];
      for (int week = 0; week < data.length; week++) {
        runningTotal += Math.random() * 50 - 10;
        DataValueDto value = new DataValueDto();
        value.setValue(runningTotal);
        value.setLabel(String.valueOf(week));
        if (total.size() <= week) {
          DataValueDto newValue = new DataValueDto();
          newValue.setLabel(value.getLabel());
          newValue.setValue(0d);
          total.add(newValue);
        }
        total.get(week).setValue(total.get(week).getValue() + value.getValue());
        data[week] = value;
      }
      dto.setData(data);
      response.add(dto);
    }
    DataLineDto totalLine = new DataLineDto();
    totalLine.setLabel("Total");
    totalLine.setData(total.toArray(new DataValueDto[0]));
    response.add(totalLine);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/netWorth")
  public ResponseEntity<Collection<DataValueDto>> netWorth(
      @RequestParam(required = false) String accountId) {
    List<DataValueDto> response = new ArrayList<>(12);
    Page<Account> accounts = accountService.getAccountsOfUser();
    final double[] total = {0};
    accounts.forEach(
        account -> {
          DataValueDto dto = new DataValueDto();
          dto.setLabel(account.getName());
          dto.setValue(Math.random() * 50000);
          total[0] += dto.getValue();
          response.add(dto);
        });
    DataValueDto totalDto = new DataValueDto();
    totalDto.setLabel("Total");
    totalDto.setValue(total[0]);
    response.addFirst(totalDto);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/summary/netWorth")
  public ResponseEntity<Collection<DataLineDto>> netWorthAnalysis(
      @RequestParam(required = false) String accountId) {
    Collection<DataLineDto> response = new ArrayList<>();
    List<DataValueDto> total = new ArrayList<>();
    Page<Account> accounts = accountService.getAccountsOfUser();
    for (Account account : accounts) {
      double runningTotal = 0;
      DataLineDto dto = new DataLineDto();
      dto.setLabel(account.getName());
      List<DataValueDto> data = new ArrayList<>();
      int index = 0;
      for (int year = 2022; year < 2024; year++) {
        for (Month month : Month.values()) {
          runningTotal += Math.random() * 5000 - 1000;
          DataValueDto value = new DataValueDto();
          value.setValue(runningTotal);
          if (month.ordinal() != 0) {
            value.setLabel(month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + "-" + year);
          } else {
            value.setLabel(String.valueOf(year));
          }
          if (total.size() <= index) {
            DataValueDto newValue = new DataValueDto();
            newValue.setLabel(value.getLabel());
            newValue.setValue(0d);
            total.add(newValue);
          }
          total.get(index).setValue(total.get(index).getValue() + value.getValue());

          data.add(value);
          index++;
        }
      }
      dto.setData(data.toArray(new DataValueDto[0]));
      response.add(dto);
    }
    DataLineDto totalLine = new DataLineDto();
    totalLine.setLabel("Total");
    totalLine.setData(total.toArray(new DataValueDto[0]));
    response.add(totalLine);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/summary/incomeExpense")
  public ResponseEntity<Collection<Collection<DataValueDto>>> incomeExpenseAnalysis(
      @RequestParam(required = false) String accountId, @RequestParam int year) {
    Collection<Collection<DataValueDto>> response = new ArrayList<>();
    for (Month month : Month.values()) {
      List<DataValueDto> dtos = List.of(new DataValueDto(), new DataValueDto());
      dtos.get(0).setLabel("Incomes");
      dtos.get(1).setLabel("Expenses");
      dtos.get(0).setValue(Math.random() * 5000);
      dtos.get(1).setValue(-Math.random() * 5000);
      response.add(dtos);
    }
    return ResponseEntity.ok(response);
  }

  protected Collection<DataValueDto> createDtos(Iterable<Category> entities) {
    Collection<DataValueDto> dtos = new ArrayList<>();
    for (Category entity : entities) {
      dtos.add(createDto(entity));
    }
    return dtos;
  }

  private DataValueDto createDto(Category entity) {
    DataValueDto dto = new DataValueDto();
    dto.setLabel(entity.getName());
    return dto;
  }
}

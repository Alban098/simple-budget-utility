/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.*;
import org.alban098.sbu.dto.DataLineDto;
import org.alban098.sbu.dto.DataValueDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.service.AccountService;
import org.alban098.sbu.service.AnalysisService;
import org.alban098.sbu.service.CurrencyService;
import org.alban098.sbu.utils.Currency;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis/")
public class AnalysisController {

  private final AccountService accountService;
  private final AnalysisService analysisService;
  private final CurrencyService currencyService;

  public AnalysisController(
      AccountService accountService,
      AnalysisService analysisService,
      CurrencyService currencyService) {
    this.accountService = accountService;
    this.analysisService = analysisService;
    this.currencyService = currencyService;
  }

  @GetMapping("/refresh")
  public ResponseEntity<?> refresh() {
    currencyService.refreshExchangeRate();
    return ResponseEntity.ok().build();
  }

  @GetMapping("/category")
  public ResponseEntity<Collection<DataValueDto>> analysis(
      @RequestParam(required = false) String accountId, @RequestParam Currency currency) {
    Account account = null;
    if (accountId != null) {
      account = accountService.getAccount(accountId);
    }
    Collection<DataValueDto> dtos =
        analysisService.categorize(
            account, currency, LocalDate.of(2000, 1, 1), LocalDate.of(3000, 1, 1));
    return ResponseEntity.ok(dtos);
  }

  @GetMapping("/category/yearly")
  public ResponseEntity<Collection<DataValueDto>> yearlyAnalysis(
      @RequestParam(required = false) String accountId,
      @RequestParam int year,
      @RequestParam Currency currency) {
    Account account = null;
    if (accountId != null) {
      account = accountService.getAccount(accountId);
    }
    Collection<DataValueDto> dtos =
        analysisService.categorize(
            account, currency, LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31));
    return ResponseEntity.ok(dtos);
  }

  @GetMapping("/category/monthly")
  public ResponseEntity<Collection<DataValueDto>> monthlyAnalysis(
      @RequestParam(required = false) String accountId,
      @RequestParam int month,
      @RequestParam int year,
      @RequestParam Currency currency) {
    Account account = null;
    if (accountId != null) {
      account = accountService.getAccount(accountId);
    }
    Collection<DataValueDto> dtos =
        analysisService.categorize(
            account,
            currency,
            LocalDate.of(year, month, 1),
            LocalDate.of(year, month, Month.of(month).length(Year.of(year).isLeap())));
    return ResponseEntity.ok(dtos);
  }

  @GetMapping("/category/yearly/month")
  public ResponseEntity<Collection<Collection<DataValueDto>>> yearlyMonthAnalysis(
      @RequestParam(required = false) String accountId,
      @RequestParam int year,
      @RequestParam Currency currency) {
    Account account = null;
    if (accountId != null) {
      account = accountService.getAccount(accountId);
    }
    List<Collection<DataValueDto>> response = new ArrayList<>(12);
    for (Month month : Month.values()) {
      Collection<DataValueDto> dtos =
          analysisService.categorize(
              account,
              currency,
              LocalDate.of(year, month, 1),
              LocalDate.of(year, month, month.length(Year.of(year).isLeap())));
      response.add(dtos);
    }
    return ResponseEntity.ok(response);
  }

  @GetMapping("/netWorth")
  public ResponseEntity<Collection<DataValueDto>> netWorth(@RequestParam Currency currency) {
    Collection<Account> accounts = accountService.getAccountsOfUser();
    return ResponseEntity.ok(analysisService.netWorth(accounts, currency));
  }

  @GetMapping("/summary/netWorth/yearly")
  public ResponseEntity<Collection<DataLineDto>> netWorthYearlyAnalysis(
      @RequestParam int year, @RequestParam Currency currency) {
    Collection<Account> accounts = accountService.getAccountsOfUser();
    return ResponseEntity.ok(
        analysisService.netWorthHistory(
            accounts, currency, LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31)));
  }

  @GetMapping("/summary/netWorth")
  public ResponseEntity<Collection<DataLineDto>> netWorthAnalysis(@RequestParam Currency currency) {
    Collection<Account> accounts = accountService.getAccountsOfUser();
    return ResponseEntity.ok(
        analysisService.netWorthHistory(
            accounts, currency, LocalDate.of(2000, 1, 1), LocalDate.of(3000, 1, 1)));
  }

  @GetMapping("/summary/incomeExpense")
  public ResponseEntity<Collection<Collection<DataValueDto>>> incomeExpenseAnalysis(
      @RequestParam(required = false) String accountId,
      @RequestParam int year,
      @RequestParam Currency currency) {
    Account account = null;
    if (accountId != null) {
      account = accountService.getAccount(accountId);
    }
    return ResponseEntity.ok(analysisService.yearlyTransit(account, year, currency));
  }
}

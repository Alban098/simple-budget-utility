/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import java.time.LocalDate;
import java.time.Month;
import java.time.Period;
import java.time.Year;
import java.time.format.TextStyle;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import lombok.AllArgsConstructor;
import org.alban098.sbu.dto.DataLineDto;
import org.alban098.sbu.dto.DataValueDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Amount;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.utils.Currency;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AnalysisService {

  private final TransactionService transactionService;
  private final CurrencyService currencyService;

  private enum AggregationType {
    ALL,
    INCOMES,
    EXPENSES
  }

  public Collection<DataValueDto> categorize(
      Account account, Currency currency, LocalDate startDate, LocalDate endDate) {
    Map<String, DataValueDto> result = new HashMap<>();
    Iterable<Transaction> transactions =
        account != null
            ? transactionService.getTransactionsOfAccount(account, startDate, endDate)
            : transactionService.getTransactionsOfUser(startDate, endDate);
    for (Transaction transaction : transactions) {
      double total = 0;
      for (Amount amount : transaction.getAmounts()) {
        if (amount.getValue() < 0) {
          // Negative, but we want to display as a positive expenses
          total -= currencyService.convert(amount, currency);
        }
      }
      if (total != 0) {
        DataValueDto valueDto =
            result.computeIfAbsent(
                transaction.getCategory().getId(),
                catId -> new DataValueDto(transaction.getCategory().getName(), 0d));
        valueDto.setValue(valueDto.getValue() + total);
      }
    }
    return result.values();
  }

  public Collection<DataValueDto> netWorth(Page<Account> accounts, Currency currency) {
    Collection<DataValueDto> result = new ArrayList<>(accounts.getSize() + 1);
    DataValueDto total = new DataValueDto("Total", 0d);
    result.add(total);
    for (Account account : accounts) {
      DataValueDto accountTotal = new DataValueDto(account.getName(), 0d);
      result.add(accountTotal);
      Iterable<Transaction> transactions =
          transactionService.getTransactionsOfAccount(account, Pageable.unpaged());
      for (Transaction transaction : transactions) {
        double transactionTotal = 0;
        for (Amount amount : transaction.getAmounts()) {
          transactionTotal += currencyService.convert(amount, currency);
        }
        accountTotal.setValue(accountTotal.getValue() + transactionTotal);
        total.setValue(total.getValue() + transactionTotal);
      }
    }
    return result;
  }

  public Collection<DataLineDto> netWorthHistory(
      Page<Account> accounts, Currency currency, LocalDate startDate, LocalDate endDate) {
    if (endDate.toEpochDay() - startDate.toEpochDay() > 366) {
      return netWorthLongScale(accounts, currency, startDate, endDate);
    }
    return netWorthShortScale(accounts, currency, startDate, endDate);
  }

  private double aggregateOver(
      Account account,
      Currency currency,
      LocalDate startDate,
      LocalDate endDate,
      AggregationType aggregationType) {
    Iterable<Transaction> transactions;
    LocalDate actualEndDate = endDate.minusDays(1);
    switch (aggregationType) {
      case INCOMES -> transactions =
          account != null
              ? transactionService.getPositiveTransactionsOfAccount(
                  account, startDate, actualEndDate)
              : transactionService.getPositiveTransactionsOfUser(startDate, actualEndDate);
      case EXPENSES -> transactions =
          account != null
              ? transactionService.getNegativeTransactionsOfAccount(
                  account, startDate, actualEndDate)
              : transactionService.getNegativeTransactionsOfUser(startDate, actualEndDate);
      default -> transactions =
          account != null
              ? transactionService.getTransactionsOfAccount(account, startDate, actualEndDate)
              : transactionService.getTransactionsOfUser(startDate, actualEndDate);
    }

    double total = 0;
    for (Transaction transaction : transactions) {
      for (Amount amount : transaction.getAmounts()) {
        if (aggregationType == AggregationType.ALL
            || aggregationType == AggregationType.INCOMES && amount.getValue() > 0
            || aggregationType == AggregationType.EXPENSES && amount.getValue() < 0) {
          total += currencyService.convert(amount, currency);
        }
      }
    }
    return total;
  }

  private Collection<DataLineDto> netWorthShortScale(
      Page<Account> accounts, Currency currency, LocalDate startDate, LocalDate endDate) {
    Collection<DataLineDto> analysis = new ArrayList<>();
    List<DataValueDto> total = new ArrayList<>();
    for (Account account : accounts) {
      final double[] runningTotal = {0};
      DataLineDto dto = new DataLineDto();
      dto.setLabel(account.getName());
      List<DataValueDto> data = new ArrayList<>();
      AtomicReference<LocalDate> periodStartDate = new AtomicReference<>(startDate);
      startDate
          .datesUntil(endDate, Period.ofWeeks(1))
          .forEach(
              weekDate -> {
                runningTotal[0] +=
                    aggregateOver(
                        account, currency, periodStartDate.get(), weekDate, AggregationType.ALL);
                DataValueDto value = new DataValueDto();
                value.setValue(runningTotal[0]);
                value.setLabel(String.valueOf(data.size()));
                accumulateTotal(total, data.size(), value);
                data.add(value);
                periodStartDate.set(weekDate);
              });
      dto.setData(data.toArray(new DataValueDto[0]));
      analysis.add(dto);
    }
    DataLineDto totalLine = new DataLineDto();
    totalLine.setLabel("Total");
    totalLine.setData(total.toArray(new DataValueDto[0]));
    analysis.add(totalLine);
    return analysis;
  }

  private Collection<DataLineDto> netWorthLongScale(
      Page<Account> accounts, Currency currency, LocalDate startDate, LocalDate endDate) {
    Collection<DataLineDto> response = new ArrayList<>();
    List<DataValueDto> total = new ArrayList<>();
    for (Account account : accounts) {
      double runningTotal = 0;
      LocalDate restrictedStartDate =
          transactionService.getDateOfFirstTransaction(account, startDate, endDate).minusMonths(1);
      LocalDate restrictedEndDate =
          transactionService.getDateOfLastTransaction(account, startDate, endDate).plusMonths(1);

      DataLineDto currentAccountLine = new DataLineDto();
      currentAccountLine.setLabel(account.getName());
      List<DataValueDto> dataPoints = new ArrayList<>();
      int index = 0;
      for (int year = restrictedStartDate.getYear(); year <= restrictedEndDate.getYear(); year++) {
        int monthStart =
            year == restrictedStartDate.getYear() ? restrictedStartDate.getMonth().getValue() : 1;
        for (int month = monthStart; month <= 12; month++) {
          if (year == restrictedEndDate.getYear()
              && month > restrictedEndDate.getMonth().getValue()) {
            break;
          }
          runningTotal +=
              aggregateOver(
                  account,
                  currency,
                  LocalDate.of(year, month, 1),
                  LocalDate.of(year, month, Month.of(month).length(Year.of(year).isLeap())),
                  AggregationType.ALL);
          DataValueDto value = new DataValueDto();
          value.setValue(runningTotal);
          value.setLabel(computeLongScaleLabel(month, year));

          accumulateTotal(total, index, value);
          dataPoints.add(value);
          index++;
        }
      }
      currentAccountLine.setData(dataPoints.toArray(new DataValueDto[0]));
      response.add(currentAccountLine);
    }
    DataLineDto totalLine = new DataLineDto();
    totalLine.setLabel("Total");
    totalLine.setData(total.toArray(new DataValueDto[0]));
    response.add(totalLine);
    return response;
  }

  private static void accumulateTotal(List<DataValueDto> total, int index, DataValueDto value) {
    if (total.size() <= index) {
      DataValueDto newValue = new DataValueDto();
      newValue.setLabel(value.getLabel());
      newValue.setValue(0d);
      total.add(newValue);
    }
    total.get(index).setValue(total.get(index).getValue() + value.getValue());
  }

  private String computeLongScaleLabel(int month, int year) {
    if (Month.of(month).ordinal() != 0) {
      return Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + "-" + year;
    } else {
      return String.valueOf(year);
    }
  }

  public Collection<Collection<DataValueDto>> yearlyTransit(
      Account account, int year, Currency currency) {
    Collection<Collection<DataValueDto>> response = new ArrayList<>();
    for (Month month : Month.values()) {
      response.add(
          List.of(
              new DataValueDto(
                  "Incomes",
                  aggregateOver(
                      account,
                      currency,
                      LocalDate.of(year, month, 1),
                      LocalDate.of(year, month, month.length(Year.of(year).isLeap())),
                      AggregationType.INCOMES)),
              new DataValueDto(
                  "Expenses",
                  aggregateOver(
                      account,
                      currency,
                      LocalDate.of(year, month, 1),
                      LocalDate.of(year, month, month.length(Year.of(year).isLeap())),
                      AggregationType.EXPENSES))));
    }
    return response;
  }
}

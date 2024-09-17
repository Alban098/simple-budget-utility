/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.alban098.sbu.dto.*;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.repository.TransactionRepository;
import org.alban098.sbu.utils.ForbiddenException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TransactionService {

  private final TransactionRepository transactionRepository;
  private final IAuthenticationFacade authenticationFacade;
  private final AccountService accountService;
  private final CategoryService categoryService;

  public Iterable<Transaction> getTransactionsOfUser(final LocalDate from, final LocalDate to) {
    return transactionRepository.findByUserAndDateBetweenOrderByDateAsc(
        authenticationFacade.getCurrentUser(), from, to);
  }

  public Iterable<Transaction> getPositiveTransactionsOfAccount(
      final Account account, final LocalDate from, final LocalDate to) {
    return transactionRepository.findByAccountAndDateBetweenAndAmountsPositiveOrderByDateAsc(
        account, from, to);
  }

  public Iterable<Transaction> getPositiveTransactionsOfUser(
      final LocalDate from, final LocalDate to) {
    return transactionRepository.findByUserAndDateBetweenAndAmountPositiveThanOrderByDateAsc(
        authenticationFacade.getCurrentUser(), from, to);
  }

  public Iterable<Transaction> getNegativeTransactionsOfAccount(
      final Account account, final LocalDate from, final LocalDate to) {
    return transactionRepository.findByAccountAndDateBetweenAndAmountsNegativeOrderByDateAsc(
        account, from, to);
  }

  public Iterable<Transaction> getNegativeTransactionsOfUser(
      final LocalDate from, final LocalDate to) {
    return transactionRepository.findByUserAndDateBetweenAndAmountNegativeThanOrderByDateAsc(
        authenticationFacade.getCurrentUser(), from, to);
  }

  public Iterable<Transaction> getTransactionsOfAccount(
      final Account account, final LocalDate from, final LocalDate to) {
    return transactionRepository.findByAccountAndDateBetweenOrderByDateAsc(account, from, to);
  }

  public Iterable<Transaction> getTransactionsOfUser() {
    return transactionRepository.findByUser(authenticationFacade.getCurrentUser());
  }

  public Iterable<Transaction> getTransactionsOfAccount(final Account account) {
    return transactionRepository.findByAccount(account);
  }

  public Transaction getTransaction(final String id) {
    return transactionRepository.findById(id).orElse(null);
  }

  public Transaction create(TransactionUpdateDto transactionDto) {
    Transaction transaction = new Transaction();
    if (transactionDto.getAccount() == null) {
      throw new RuntimeException("Account is required");
    }
    if (transactionDto.getCategory() == null) {
      throw new RuntimeException("Category is required");
    }
    if (transactionDto.getDate() == null) {
      throw new RuntimeException("Date is required");
    }
    Account account = accountService.getAccount(transactionDto.getAccount().getId());
    accountService.checkAccount(account);
    transaction.setAccount(account);

    Category category = categoryService.getCategory(transactionDto.getCategory().getId());
    if (category == null) {
      throw new EntityNotFoundException(
          "Category not found : " + transactionDto.getCategory().getId());
    }
    transaction.setCategory(category);
    transaction.setDate(transactionDto.getDate());
    transaction.setDescription(transactionDto.getDescription());
    for (AmountDto amount : transactionDto.getAmounts()) {
      if (amount != null && amount.getValue() != null) {
        transaction.setAmount(amount.getCurrency(), amount.getValue());
      }
    }
    return transactionRepository.save(transaction);
  }

  public Transaction update(String id, TransactionUpdateDto transactionDto) {
    Transaction transaction = transactionRepository.findById(id).orElse(null);
    checkTransaction(transaction);
    if (transactionDto.getAccount() != null) {
      Account account = accountService.getAccount(transactionDto.getAccount().getId());
      accountService.checkAccount(account);
      transaction.setAccount(account);
    }
    if (transactionDto.getCategory() != null) {
      Category category = categoryService.getCategory(transactionDto.getCategory().getId());
      transaction.setCategory(category);
      if (category == null) {
        throw new EntityNotFoundException(
            "Category not found : " + transactionDto.getCategory().getId());
      }
    }
    transaction.setDate(
        transactionDto.getDate() == null ? transaction.getDate() : transactionDto.getDate());
    transaction.setDescription(
        transactionDto.getDescription() == null
            ? transaction.getDescription()
            : transactionDto.getDescription());
    for (AmountDto amount : transactionDto.getAmounts()) {
      if (amount != null && amount.getValue() != null) {
        transaction.setAmount(amount.getCurrency(), amount.getValue());
      }
    }
    return transactionRepository.save(transaction);
  }

  public void delete(String id) {
    Transaction transaction = transactionRepository.findById(id).orElse(null);
    checkTransaction(transaction);
    transactionRepository.delete(transaction);
  }

  public void checkTransaction(Transaction transaction) {
    if (transaction == null
        || !transaction.getAccount().getUser().equals(authenticationFacade.getCurrentUser())) {
      throw new ForbiddenException(
          "This Transaction does not belong to an account of the logged in User");
    }
  }

  public TransactionDto createDto(Transaction transaction) {
    TransactionDto transactionDto = new TransactionDto();
    transactionDto.setId(transaction.getId());
    transactionDto.setDate(transaction.getDate());
    transactionDto.setDescription(transaction.getDescription());
    transactionDto.setCategory(transaction.getCategory().getName());
    transactionDto.setAccount(transaction.getAccount().getName());
    transaction.getAmounts().stream()
        .filter(amount -> amount != null && amount.getValue() != null && amount.getValue() != 0)
        .forEach(amount -> transactionDto.setAmount(amount.getCurrency(), amount.getValue()));
    return transactionDto;
  }

  public Collection<TransactionDto> createDtos(Iterable<Transaction> transactions) {
    Collection<TransactionDto> dtos = new ArrayList<>();
    for (Transaction transaction : transactions) {
      dtos.add(createDto(transaction));
    }
    return dtos;
  }

  public LocalDate getDateOfFirstTransaction(
      Account account, LocalDate startDate, LocalDate endDate) {
    Optional<Transaction> transaction =
        transactionRepository.getFirstTransactionOfAccount(account, startDate, endDate);
    if (transaction.isPresent()) {
      return transaction.get().getDate();
    }
    return LocalDate.now();
  }

  public LocalDate getDateOfLastTransaction(
      Account account, LocalDate startDate, LocalDate endDate) {
    Optional<Transaction> transaction =
        transactionRepository.getLastTransactionOfAccount(account, startDate, endDate);
    if (transaction.isPresent()) {
      return transaction.get().getDate();
    }
    return LocalDate.now();
  }
}
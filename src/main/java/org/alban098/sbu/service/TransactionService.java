/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import lombok.AllArgsConstructor;
import org.alban098.sbu.dto.AmountDto;
import org.alban098.sbu.dto.TransactionDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.repository.TransactionRepository;
import org.alban098.sbu.utils.ForbiddenException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TransactionService {

  private final TransactionRepository transactionRepository;
  private final IAuthenticationFacade authenticationFacade;
  private final AccountService accountService;
  private final CategoryService categoryService;

  public Page<Transaction> getTransactionsOfUser(final Pageable pageable) {
    return transactionRepository.findByUser(authenticationFacade.getCurrentUser(), pageable);
  }

  public Page<Transaction> getTransactionsOfAccount(
      final Account account, final Pageable pageable) {
    return transactionRepository.findByAccount(account, pageable);
  }

  public Transaction getTransaction(final String id) {
    return transactionRepository.findById(id).orElse(null);
  }

  public Transaction create(TransactionDto transactionDto) {
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
      throw new RuntimeException("Category is not found");
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

  public Transaction update(String id, TransactionDto transactionDto) {
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
        throw new RuntimeException("Category is not found");
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
      throw new ForbiddenException("This transaction does not belong to this user account");
    }
  }
}

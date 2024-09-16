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
import java.util.Collection;
import org.alban098.sbu.dto.TransactionDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.service.AccountService;
import org.alban098.sbu.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

  private final TransactionService transactionService;
  private final AccountService accountService;

  public TransactionController(
      TransactionService transactionService, AccountService accountService) {
    this.transactionService = transactionService;
    this.accountService = accountService;
  }

  @GetMapping("/")
  public ResponseEntity<Collection<TransactionDto>> list(
      @RequestParam(required = false) String accountId) {
    if (accountId != null) {
      Account account = accountService.getAccount(accountId);
      accountService.checkAccount(account);
      Page<Transaction> transactions =
          transactionService.getTransactionsOfAccount(
              account, PageRequest.of(0, 100, Sort.by("date").descending()));
      return ResponseEntity.ok(transactionService.createDtos(transactions));
    }
    Page<Transaction> transactions =
        transactionService.getTransactionsOfUser(
            PageRequest.of(0, 100, Sort.by("date").descending()));
    return ResponseEntity.ok(transactionService.createDtos(transactions));
  }

  @GetMapping("/{id}")
  public ResponseEntity<TransactionDto> show(@PathVariable String id) {
    Transaction transaction = transactionService.getTransaction(id);
    transactionService.checkTransaction(transaction);
    return ResponseEntity.ok(transactionService.createDto(transaction));
  }

  @PostMapping("/")
  public ResponseEntity<TransactionDto> create(@RequestBody TransactionDto transactionDto)
      throws URISyntaxException {
    Transaction transaction = transactionService.create(transactionDto);
    return ResponseEntity.created(new URI("/api/transaction/" + transaction.getId()))
        .body(transactionService.createDto(transaction));
  }

  @PutMapping("/{id}")
  public ResponseEntity<TransactionDto> update(
      @PathVariable String id, @RequestBody TransactionDto transactionDto) {
    Transaction transaction = transactionService.update(id, transactionDto);
    return ResponseEntity.ok(transactionService.createDto(transaction));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<TransactionDto> delete(@PathVariable String id) {
    transactionService.delete(id);
    return ResponseEntity.ok().build();
  }
}

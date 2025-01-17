/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.Collection;
import java.util.List;
import org.alban098.sbu.dto.*;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Bank;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.service.AccountService;
import org.alban098.sbu.service.AccountStatementImportService;
import org.alban098.sbu.service.TransactionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

  private final TransactionService transactionService;
  private final AccountService accountService;
  private final AccountStatementImportService accountStatementImportService;

  public TransactionController(
      TransactionService transactionService,
      AccountService accountService,
      AccountStatementImportService accountStatementImportService) {
    this.transactionService = transactionService;
    this.accountService = accountService;
    this.accountStatementImportService = accountStatementImportService;
  }

  @GetMapping("/")
  public ResponseEntity<Collection<TransactionDto>> list(
      @RequestParam(required = false) String accountId) {
    if (accountId != null) {
      Account account = accountService.getAccount(accountId);
      accountService.checkAccount(account);
      Iterable<Transaction> transactions = transactionService.getTransactionsOfAccount(account);
      return ResponseEntity.ok(transactionService.createDtos(transactions, false));
    }
    Iterable<Transaction> transactions = transactionService.getTransactionsOfUser();
    return ResponseEntity.ok(transactionService.createDtos(transactions, false));
  }

  @GetMapping("/{id}")
  public ResponseEntity<TransactionDto> show(@PathVariable String id) {
    Transaction transaction = transactionService.getTransaction(id);
    transactionService.checkTransaction(transaction);
    return ResponseEntity.ok(transactionService.createDto(transaction, true));
  }

  @PostMapping("/")
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity<TransactionDto> create(@RequestBody TransactionUpdateDto transactionDto)
      throws URISyntaxException {
    Transaction transaction = transactionService.create(transactionDto, false);
    return ResponseEntity.created(new URI("/api/transaction/" + transaction.getId()))
        .body(transactionService.createDto(transaction, true));
  }

  @PostMapping(
      path = "/import",
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
  public ResponseEntity<ImportStatementDto> importTransaction(@ModelAttribute ImportDto importDto)
      throws IOException, ParseException {
    Account account = accountService.getAccount(importDto.getAccount());
    Collection<Transaction> transactions =
        accountStatementImportService.importTransactions(
            Bank.valueOf(importDto.getBank()), account, importDto.getFile().getBytes());
    ImportStatementDto dto = new ImportStatementDto();
    dto.setTransactions(
        transactionService.createDtos(transactions, true).toArray(new TransactionDto[0]));
    dto.setFileName(importDto.getFile().getOriginalFilename());
    dto.setAccountId(account.getId());
    return ResponseEntity.ok(dto);
  }

  @PostMapping("/import/finalize")
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity<Collection<TransactionDto>> finalizeImport(
      @RequestBody ImportStatementDto dto) {
    List<Transaction> savedTransactions =
        transactionService.importTransactions(dto.getTransactions());
    accountStatementImportService.registerFile(dto);
    return ResponseEntity.ok(transactionService.createDtos(savedTransactions, true));
  }

  @PutMapping("/{id}")
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity<TransactionDto> update(
      @PathVariable String id, @RequestBody TransactionUpdateDto transactionDto) {
    Transaction transaction = transactionService.update(id, transactionDto);
    return ResponseEntity.ok(transactionService.createDto(transaction, false));
  }

  @DeleteMapping("/{id}")
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity<TransactionDto> delete(@PathVariable String id) {
    transactionService.delete(id);
    return ResponseEntity.ok().build();
  }
}

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
import java.util.Collection;
import org.alban098.sbu.controller.AbstractController;
import org.alban098.sbu.dto.*;
import org.alban098.sbu.dto.TransactionDto;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transaction")
public class TransactionApiController extends AbstractController<Transaction> {

  private final TransactionService transactionService;
  private final AccountApiController accountApiController;
  private final CategoryApiController categoryApiController;

  public TransactionApiController(
      IAuthenticationFacade authenticationFacade,
      TransactionService transactionService,
      AccountApiController accountApiController,
      CategoryApiController categoryApiController) {
    super(authenticationFacade);
    this.transactionService = transactionService;
    this.accountApiController = accountApiController;
    this.categoryApiController = categoryApiController;
  }

  @GetMapping("/")
  public ResponseEntity<Collection<TransactionDto>> list() {
    Page<Transaction> transactions =
        transactionService.getTransactionsOfUser(
            PageRequest.of(0, 100, Sort.by("date").descending()));
    return ResponseEntity.ok(createDtos(transactions));
  }

  @GetMapping("/{id}")
  public ResponseEntity<TransactionDto> show(@PathVariable String id) {
    Transaction transaction = transactionService.getTransaction(id);
    transactionService.checkTransaction(transaction);
    return ResponseEntity.ok(createDto(transaction));
  }

  @PostMapping("/")
  public ResponseEntity<TransactionDto> create(@RequestBody TransactionDto transactionDto)
      throws URISyntaxException {
    Transaction transaction = transactionService.create(transactionDto);
    return ResponseEntity.created(new URI("/api/transaction/" + transaction.getId()))
        .body(createDto(transaction));
  }

  @PutMapping("/{id}")
  public ResponseEntity<TransactionDto> update(
      @PathVariable String id, @RequestBody TransactionDto transactionDto) {
    Transaction transaction = transactionService.update(id, transactionDto);
    return ResponseEntity.ok(createDto(transaction));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<TransactionDto> delete(@PathVariable String id) {
    transactionService.delete(id);
    return ResponseEntity.ok().build();
  }

  @Override
  protected TransactionDto createDto(Transaction transaction) {
    AccountDto accountDto = accountApiController.createDto(transaction.getAccount());
    CategoryDto categoryDto = categoryApiController.createDto(transaction.getCategory());
    TransactionDto transactionDto = new TransactionDto();
    transactionDto.setId(transaction.getId());
    transactionDto.setDate(transaction.getDate());
    transactionDto.setDescription(transaction.getDescription());
    transactionDto.setCategory(categoryDto);
    transactionDto.setAccount(accountDto);
    transaction
        .getAmounts()
        .forEach(amount -> transactionDto.setAmount(amount.getCurrency(), amount.getValue()));
    return transactionDto;
  }
}

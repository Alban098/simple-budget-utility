/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller;

import java.util.Collection;
import org.alban098.sbu.dto.AccountDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.service.AccountService;
import org.alban098.sbu.utils.Currency;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

  private final AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/")
  public ResponseEntity<Collection<AccountDto>> list(
      @RequestParam Currency currency, @RequestParam boolean shallow) {
    Collection<Account> accounts = accountService.getAccountsOfUser();
    Collection<AccountDto> accountDtos = accountService.createDtos(accounts, currency, shallow);
    return ResponseEntity.ok(accountDtos);
  }

  @GetMapping("/{id}")
  public ResponseEntity<AccountDto> show(
      @PathVariable String id, @RequestParam Currency currency, @RequestParam boolean shallow) {
    Account account = accountService.getAccount(id);
    accountService.checkAccount(account);
    AccountDto accountDto = accountService.createDto(account, currency, shallow);
    return ResponseEntity.ok(accountDto);
  }

  @PostMapping("/")
  public ResponseEntity<AccountDto> create(@RequestBody AccountDto accountDto) {
    Account account = accountService.create(accountDto);
    return ResponseEntity.ok(accountService.createDto(account));
  }

  @PutMapping("/{id}")
  public ResponseEntity<AccountDto> update(
      @PathVariable String id, @RequestBody AccountDto accountDto) {
    Account account = accountService.update(id, accountDto);
    return ResponseEntity.ok(accountService.createDto(account));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> delete(@PathVariable String id) {
    accountService.delete(id);
    return ResponseEntity.ok(id);
  }
}

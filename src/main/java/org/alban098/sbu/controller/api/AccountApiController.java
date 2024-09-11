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
import org.alban098.sbu.dto.AccountDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.service.AccountService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountApiController extends AbstractController<Account> {

  private final AccountService accountService;

  public AccountApiController(
      IAuthenticationFacade authenticationFacade, AccountService accountService) {
    super(authenticationFacade);
    this.accountService = accountService;
  }

  @GetMapping("/")
  public ResponseEntity<Collection<AccountDto>> list() {
    Page<Account> accounts = accountService.getAccountsOfUser();
    return ResponseEntity.ok(createDtos(accounts));
  }

  @GetMapping("/{id}")
  public ResponseEntity<AccountDto> show(@PathVariable String id) {
    Account account = accountService.getAccount(id);
    accountService.checkAccount(account);
    return ResponseEntity.ok(createDto(account));
  }

  @PostMapping("/")
  public ResponseEntity<AccountDto> create(@RequestBody AccountDto accountDto)
      throws URISyntaxException {
    Account account = accountService.create(accountDto);
    return ResponseEntity.created(new URI("/api/account/" + account.getId()))
        .body(createDto(account));
  }

  @PutMapping("/{id}")
  public ResponseEntity<AccountDto> update(
      @PathVariable String id, @RequestBody AccountDto accountDto) {
    Account account = accountService.update(id, accountDto);
    return ResponseEntity.ok(createDto(account));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<AccountDto> delete(@PathVariable String id) {
    accountService.delete(id);
    return ResponseEntity.ok().build();
  }

  @Override
  protected AccountDto createDto(Account account) {
    AccountDto accountDto = new AccountDto();
    accountDto.setId(account.getId());
    accountDto.setName(account.getName());
    accountDto.setDescription(account.getDescription());
    return accountDto;
  }
}

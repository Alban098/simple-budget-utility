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
import org.alban098.sbu.dto.AmountDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.service.AccountService;
import org.alban098.sbu.utils.Currency;
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
  public ResponseEntity<Collection<AccountDto>> list(@RequestParam Currency currency) {
    Page<Account> accounts = accountService.getAccountsOfUser();
    Collection<AccountDto> accountDtos = createDtos(accounts);
    accountDtos.forEach(accountDto -> accountDto.getAmount().setCurrency(currency));
    return ResponseEntity.ok(accountDtos);
  }

  @GetMapping("/{id}")
  public ResponseEntity<AccountDto> show(@PathVariable String id, @RequestParam Currency currency) {
    Account account = accountService.getAccount(id);
    accountService.checkAccount(account);
    AccountDto accountDto = createDto(account);
    accountDto.getAmount().setCurrency(currency);
    return ResponseEntity.ok(accountDto);
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
    accountDto.setBalance(Currency.CHF, Math.random() * 15000 - 3000);
    accountDto.setBalance(Currency.EUR, Math.random() * 15000 - 3000);
    double total = 0;
    for (AmountDto balance : accountDto.getBalances()) {
      total += balance.getValue() * (balance.getCurrency() == Currency.CHF ? 1.05 : 1);
    }
    accountDto.setAmount(new AmountDto(total, Currency.EUR));
    return accountDto;
  }
}

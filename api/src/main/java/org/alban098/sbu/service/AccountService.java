/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import java.util.*;
import lombok.AllArgsConstructor;
import org.alban098.sbu.dto.AccountDto;
import org.alban098.sbu.dto.AmountDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Amount;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.repository.AccountRepository;
import org.alban098.sbu.utils.Currency;
import org.alban098.sbu.utils.ForbiddenException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AccountService {

  private final AccountRepository accountRepository;
  private final IAuthenticationFacade authenticationFacade;
  private final CurrencyService currencyService;

  public Collection<Account> getAccountsOfUser() {
    return accountRepository.findByUser(authenticationFacade.getCurrentUser(), Pageable.unpaged());
  }

  public Account getAccount(final String id) {
    Account account = accountRepository.findById(id).orElse(null);
    checkAccount(account);
    return account;
  }

  public Account create(AccountDto accountDto) {
    Account account = new Account();
    account.setName(accountDto.getName());
    account.setDescription(accountDto.getDescription());
    account.setUser(authenticationFacade.getCurrentUser());
    return accountRepository.save(account);
  }

  public Account update(String id, AccountDto accountDto) {
    Account account = accountRepository.findById(id).orElse(null);
    checkAccount(account);
    account.setName(accountDto.getName() == null ? account.getName() : accountDto.getName());
    account.setDescription(
        accountDto.getDescription() == null
            ? account.getDescription()
            : accountDto.getDescription());
    return accountRepository.save(account);
  }

  public void delete(String id) {
    Account account = accountRepository.findById(id).orElse(null);
    checkAccount(account);
    accountRepository.delete(account);
  }

  public AccountDto createDto(Account account) {
    AccountDto accountDto = new AccountDto();
    accountDto.setId(account.getId());
    accountDto.setName(account.getName());
    accountDto.setDescription(account.getDescription());
    return accountDto;
  }

  public AccountDto createDto(Account account, Currency currency) {
    AccountDto accountDto = createDto(account);
    computeBalance(account).forEach(accountDto::setBalance);
    accountDto.setAmount(computeTotal(accountDto, currency));
    return accountDto;
  }

  public Collection<AccountDto> createDtos(Iterable<Account> Account, Currency currency) {
    Collection<AccountDto> dtos = new ArrayList<>();
    for (Account account : Account) {
      dtos.add(createDto(account, currency));
    }
    return dtos;
  }

  public void checkAccount(Account account) {
    if (account == null || !account.getUser().equals(authenticationFacade.getCurrentUser())) {
      throw new ForbiddenException("This account does not belong to this user account");
    }
  }

  private AmountDto computeTotal(AccountDto account, Currency currency) {
    AmountDto total = new AmountDto(0d, currency);
    for (AmountDto balance : account.getBalances()) {
      total.setValue(total.getValue() + currencyService.convert(balance, currency));
    }
    return total;
  }

  private Map<Currency, Double> computeBalance(Account account) {
    Map<Currency, Double> balances = new EnumMap<>(Currency.class);
    for (Transaction transaction : account.getTransactions()) {
      for (Amount amount : transaction.getAmounts()) {
        balances.put(
            amount.getCurrency(),
            balances.getOrDefault(amount.getCurrency(), 0d) + amount.getValue());
      }
    }
    return balances;
  }
}

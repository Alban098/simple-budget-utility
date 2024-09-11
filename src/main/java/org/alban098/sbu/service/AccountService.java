/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import lombok.AllArgsConstructor;
import org.alban098.sbu.dto.AccountDto;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.repository.AccountRepository;
import org.alban098.sbu.utils.ForbiddenException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AccountService {

  private final AccountRepository accountRepository;
  private final IAuthenticationFacade authenticationFacade;

  public Page<Account> getAccountsOfUser() {
    return accountRepository.findByUser(authenticationFacade.getCurrentUser(), Pageable.unpaged());
  }

  public Account getAccount(final String id) {
    return accountRepository.findById(id).orElse(null);
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

  public void checkAccount(Account account) {
    if (account == null || !account.getUser().equals(authenticationFacade.getCurrentUser())) {
      throw new ForbiddenException("This account does not belong to this user account");
    }
  }
}

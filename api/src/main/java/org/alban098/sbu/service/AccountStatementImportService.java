/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.service;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.*;
import org.alban098.sbu.dto.ImportStatementDto;
import org.alban098.sbu.dto.ImportedStatementDto;
import org.alban098.sbu.dto.TransactionDto;
import org.alban098.sbu.entity.*;
import org.alban098.sbu.facade.IAuthenticationFacade;
import org.alban098.sbu.repository.ImportedStatementRepository;
import org.alban098.sbu.strategy.AccountStatementImportStrategy;
import org.alban098.sbu.strategy.LbpAccountStatementImportStrategy;
import org.alban098.sbu.strategy.YuhAccountStatementImportStrategy;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;

@Service
public class AccountStatementImportService {

  private final Map<Bank, AccountStatementImportStrategy> strategies = new HashMap<>();
  private final ClassificationService classificationService;
  private final IAuthenticationFacade authenticationFacade;
  private final AccountService accountService;
  private final ImportedStatementRepository importedStatementRepository;

  public AccountStatementImportService(
      ClassificationService classificationService,
      IAuthenticationFacade authenticationFacade,
      AccountService accountService,
      ImportedStatementRepository importedStatementRepository) {
    strategies.put(Bank.LBP, new LbpAccountStatementImportStrategy());
    strategies.put(Bank.YUH, new YuhAccountStatementImportStrategy());
    this.classificationService = classificationService;
    this.authenticationFacade = authenticationFacade;
    this.accountService = accountService;
    this.importedStatementRepository = importedStatementRepository;
  }

  public List<Transaction> importTransactions(Bank bank, Account account, byte[] file)
      throws IOException, ParseException {
    try (PDDocument pdf = Loader.loadPDF(file)) {
      strategies.get(bank).setAccount(account);
      List<Transaction> transactions = strategies.get(bank).parseTransactions(pdf);
      classificationService.tryClassifyTransactions(transactions);
      return transactions;
    }
  }

  public Iterable<ImportedStatement> getImportedStatementOfUser() {
    return importedStatementRepository.findByUser(authenticationFacade.getCurrentUser());
  }

  public void registerFile(ImportStatementDto dto) {
    ImportedStatement statement = new ImportedStatement();
    statement.setDate(LocalDate.now());
    statement.setAccount(accountService.getAccount(dto.getAccountId()));
    statement.setFile(dto.getFileName());
    statement.setTransactionCount(dto.getTransactions().length);
    LocalDate min = LocalDate.MAX;
    LocalDate max = LocalDate.MIN;
    for (TransactionDto t : dto.getTransactions()) {
      if (t.getDate().isBefore(min)) {
        min = t.getDate();
      }
      if (t.getDate().isAfter(max)) {
        max = t.getDate();
      }
    }
    statement.setFirstTransactionDate(min);
    statement.setLastTransactionDate(max);
    importedStatementRepository.save(statement);
  }

  public ImportedStatementDto createDto(ImportedStatement statement) {
    ImportedStatementDto statementDto = new ImportedStatementDto();
    statementDto.setId(statement.getId());
    statementDto.setAccount(statement.getAccount().getName());
    statementDto.setDate(statement.getDate());
    statementDto.setFile(statement.getFile());
    statementDto.setTransactionCount(statement.getTransactionCount());
    statementDto.setFirstTransactionDate(statement.getFirstTransactionDate());
    statementDto.setLastTransactionDate(statement.getLastTransactionDate());
    return statementDto;
  }

  public Collection<ImportedStatementDto> createDtos(Iterable<ImportedStatement> statements) {
    Collection<ImportedStatementDto> dtos = new ArrayList<>();
    for (ImportedStatement statement : statements) {
      dtos.add(createDto(statement));
    }
    return dtos;
  }
}

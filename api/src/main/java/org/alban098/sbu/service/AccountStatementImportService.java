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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Bank;
import org.alban098.sbu.entity.Transaction;
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

  public AccountStatementImportService(ClassificationService classificationService) {
    strategies.put(Bank.LBP, new LbpAccountStatementImportStrategy());
    strategies.put(Bank.YUH, new YuhAccountStatementImportStrategy());
    this.classificationService = classificationService;
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
}

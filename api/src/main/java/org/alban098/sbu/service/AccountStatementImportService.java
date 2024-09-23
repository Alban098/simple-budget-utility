package org.alban098.sbu.service;

import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Bank;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.strategy.AccountStatementImportStrategy;
import org.alban098.sbu.strategy.LbpAccountStatementImportStrategy;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AccountStatementImportService {

  private final Map<Bank, AccountStatementImportStrategy> strategies = new HashMap<>();
  private final CategoryService categoryService;

  public AccountStatementImportService(CategoryService categoryService) {
    strategies.put(Bank.LBP, new LbpAccountStatementImportStrategy());
    this.categoryService = categoryService;
  }

  public List<Transaction> importTransactions(Bank bank, Account account, byte[] file) throws IOException, ParseException {
    try (PDDocument pdf = Loader.loadPDF(file)) {
      List<Transaction> transactions = strategies.get(bank).parseTransactions(pdf, 2024);
      transactions.forEach(transaction -> {
        transaction.setAccount(account);
        transaction.setCategory(categoryService.findFirst());
      });
      return transactions;
    }
  }
}

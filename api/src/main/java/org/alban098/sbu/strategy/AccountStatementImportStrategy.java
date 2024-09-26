/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.strategy;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Transaction;
import org.apache.pdfbox.pdmodel.PDDocument;

public interface AccountStatementImportStrategy {

  void setAccount(Account account);

  List<Transaction> parseTransactions(PDDocument fileDump) throws ParseException, IOException;
}

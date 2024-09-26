/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.strategy;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.Setter;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Bank;
import org.alban098.sbu.entity.Category;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.utils.Currency;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;

@Setter
public class YuhAccountStatementImportStrategy implements AccountStatementImportStrategy {

  private Account account;

  private static final String LINE_SEPARATOR = "\n";
  private static final NumberFormat FORMAT = NumberFormat.getInstance(Locale.US);

  @Override
  public List<Transaction> parseTransactions(PDDocument fileDump)
      throws ParseException, IOException {
    List<Transaction> transactions = new ArrayList<>();
    String content = getStringContent(fileDump);
    verifyStatementType(content);
    // The file is assumed to contain 3 statement, one for each currency, each statement start with
    // 'ACCOUNT STATEMENT in {CHF, EUR, USD}', we start from one to strip the header of the file
    String[] statements = content.split("ACCOUNT STATEMENT in ");
    for (int i = 1; i < statements.length; i++) {
      transactions.addAll(parseStatement(statements[i]));
    }
    return transactions;
  }

  private void verifyStatementType(String content) throws IOException {
    if (!content.contains("Yuh")) {
      throw new IOException(
          "Provided statement does not matched the expected format for " + Bank.LBP.name());
    }
    if (!content.contains("Swissquote")) {
      throw new IOException(
          "Provided statement does not matched the expected format for " + Bank.LBP.name());
    }
  }

  private Collection<? extends Transaction> parseStatement(String statement) throws ParseException {
    List<Transaction> transactions = new ArrayList<>();
    String[] tmp =
        statement.split(
            "Date Information Reference Debit Credit Value"
                + LINE_SEPARATOR
                + "date"
                + LINE_SEPARATOR
                + "Balance "
                + LINE_SEPARATOR);
    Currency currency = extractCurrency(tmp[0]);
    for (int page = 1; page < tmp.length; page++) {
      String[] transactionInfo = tmp[page].split(LINE_SEPARATOR);
      for (int i = 0; i < transactionInfo.length; i++) {
        if (transactionInfo[i].startsWith("Total " + currency.name())) {
          break;
        }
        if (transactionInfo[i].matches("^\\d{2}\\.\\d{2}\\.\\d{4} .+")) {
          if (transactionInfo[i].contains("{")) {
            handleSingleLineTransaction(transactionInfo, i, transactions, currency);
          } else {
            i += handleMultiLineTransaction(transactionInfo, i, transactions, currency);
          }
        }
      }
    }
    return transactions;
  }

  private static Currency extractCurrency(String headerLine) {
    return Currency.valueOf(headerLine.substring(0, 3));
  }

  /**
   * @return the number of line to skip
   */
  private int handleMultiLineTransaction(
      String[] transactionLines, int i, List<Transaction> transactions, Currency currency)
      throws ParseException {
    int iLast = i;
    String[] header = transactionLines[i++].split(" ", 2);
    String[] date = header[0].split("\\.");
    StringBuilder description = new StringBuilder(header[1]);
    while (i < transactionLines.length && !transactionLines[i].contains("{")) {
      description.append(transactionLines[i++]);
    }
    double amount = i < transactionLines.length ? extractAmount(transactionLines[i]) : 0;
    transactions.add(createTransaction(currency, date, description.toString(), amount));
    return i - iLast;
  }

  private void handleSingleLineTransaction(
      String[] transactionLines, int i, List<Transaction> transactions, Currency currency)
      throws ParseException {
    String[] split = transactionLines[i].split("\\{");
    String[] header = split[0].split(" ", 2);
    String[] date = header[0].split("\\.");
    String description = header[1];
    double amount = extractAmount(transactionLines[i]);
    transactions.add(createTransaction(currency, date, description, amount));
  }

  private static double extractAmount(String line) throws ParseException {
    String[] split = line.split("\\{");
    String amountStr = split[1].split("}")[0];
    if (isAmount(amountStr)) {
      return FORMAT.parse(amountStr).doubleValue();
    }
    return 0;
  }

  private Transaction createTransaction(
      Currency currency, String[] date, String description, double amount) {
    Transaction transaction =
        new Transaction(
            account,
            Category.UNCLASSIFIED,
            LocalDate.of(
                Integer.parseInt(date[2]), Integer.parseInt(date[1]), Integer.parseInt(date[0])),
            description);
    transaction.setAmount(currency, amount);
    transaction.setId(UUID.randomUUID().toString());
    return transaction;
  }

  private static boolean isAmount(String text) {
    return text.matches("^-?(\\d{0,3}')*\\d{0,3}\\.\\d{2}$") || text.matches("^-?\\d+\\.\\d{2}$");
  }

  private static boolean isReference(String text) {
    return text.matches("^\\d{9}$");
  }

  private static boolean isDebitColumn(double xPos) {
    return xPos > 355 && xPos < 375;
  }

  private static boolean isCreditColumn(double xPos) {
    return xPos > 425 && xPos < 435;
  }

  private static String getStringContent(PDDocument doc) throws IOException {
    PDFTextStripper stripper =
        new PDFTextStripper() {
          @Override
          protected void writeString(String text, List<TextPosition> textPositions)
              throws IOException {
            // Amounts are formatted as 1'234'567.89, so we remove ' characters
            // for formatting down the line
            if (isAmount(text)) {
              text = text.replace("'", "");
              // We encase actual amounts between braces to facilitate detection and parsing
              // further down the line, and add a '-' sign if this is a debit
              if (isCreditColumn(textPositions.getLast().getEndX())) {
                super.writeString("{" + text + "}");
                return;
              }
              if (isDebitColumn(textPositions.getLast().getEndX())) {
                super.writeString("{-" + text + "}");
                return;
              }
            }
            // Remove transaction references, because it is noise during parsing
            if (isReference(text)) {
              return;
            }
            super.writeString(text, textPositions);
          }
        };
    stripper.setLineSeparator(LINE_SEPARATOR);
    stripper.setPageEnd(LINE_SEPARATOR);
    return stripper.getText(doc);
  }
}

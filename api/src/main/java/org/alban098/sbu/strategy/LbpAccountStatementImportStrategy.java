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
public class LbpAccountStatementImportStrategy implements AccountStatementImportStrategy {

  private static final String LINE_SEPARATOR = "\n";
  private static final NumberFormat FORMAT = NumberFormat.getInstance(Locale.FRANCE);

  private Account account;

  @Override
  public List<Transaction> parseTransactions(PDDocument fileDump)
      throws ParseException, IOException {
    List<Transaction> transactions = new ArrayList<>();
    String content = getStringContent(fileDump);
    verifyStatementType(content);
    int accountStatementIndex = extractAccountStatementIndex(content);
    int year = extractYear(content);
    String[] statements = content.split("Date Opérations Débit");
    int lastMonth = 0;
    int currentStatementIndex = 0;
    // Skip the first one as it's the header and contains no transactions at all
    for (int splitIndex = 1; splitIndex < statements.length; splitIndex++) {
      String transactionArray = statements[splitIndex];
      String[] transactionInfo = transactionArray.split(LINE_SEPARATOR);
      // If we encounter this header, this means we switch to the next account in the statement list
      if (transactionInfo[1].contains("n°")
          && transactionInfo[2].startsWith("IBAN")
          && transactionInfo[3].startsWith("Ancien solde au ")) {
        currentStatementIndex++;
      }
      // Only consider transactions from the account we actually want to import into
      if (currentStatementIndex > accountStatementIndex) {
        return transactions;
      } else if (currentStatementIndex < accountStatementIndex) {
        continue;
      }
      for (int i = 0; i < transactionInfo.length; i++) {
        if (transactionInfo[i].matches("^\\d{2}/\\d{2}.*")) {
          String[] header = transactionInfo[i++].split(" ", 2);
          String[] date = header[0].split("/");
          String description = header.length > 1 ? header[1] : "";
          int currentMonth = Integer.parseInt(date[1]);
          // Handle the case from december of a year to january of the next one
          if (currentMonth < lastMonth) {
            year++;
          }

          double amount = 0;
          while (i < transactionInfo.length && !isAmount(transactionInfo[i])) {
            description += transactionInfo[i++];
          }
          if (i < transactionInfo.length && isAmount(transactionInfo[i])) {
            Number number = FORMAT.parse(transactionInfo[i]);
            amount = number.doubleValue();
          }
          Transaction transaction =
              new Transaction(
                  account,
                  Category.UNCLASSIFIED,
                  LocalDate.of(year, currentMonth, Integer.parseInt(date[0])),
                  description);
          transaction.setAmount(Currency.EUR, amount);
          transaction.setId(UUID.randomUUID().toString());
          transactions.add(transaction);
          lastMonth = currentMonth;
        }
      }
    }
    return transactions;
  }

  private void verifyStatementType(String content) throws IOException {
    if (!content.contains("Relevé de vos comptes - ")) {
      throw new IOException(
          "Provided statement does not matched the expected format for " + Bank.LBP.name());
    }
    if (!content.contains("www.labanquepostale.fr")) {
      throw new IOException(
          "Provided statement does not matched the expected format for " + Bank.LBP.name());
    }
    if (!content.contains("LA BANQUE POSTALE")) {
      throw new IOException(
          "Provided statement does not matched the expected format for " + Bank.LBP.name());
    }
  }

  private int extractAccountStatementIndex(String content) {
    String strippedContent = content.split("Situation de vos comptes au")[1];
    String[] lines = strippedContent.split(LINE_SEPARATOR);
    int i = 0;
    for (String line : lines) {
      if (line.replace(" ", "").contains("n°" + account.getAccountNumber())) {
        return i;
      }
      if (line.contains("n°")) {
        i++;
      }
    }
    return -1;
  }

  private int extractYear(String content) {
    String dateLine = content.split("Situation de vos comptes au")[1].split(LINE_SEPARATOR)[0];
    String date = dateLine.substring(dateLine.length() - 4);
    return Integer.parseInt(date);
  }

  private static boolean isAmount(String text) {
    return text.matches("^-?(\\d{0,3} )*\\d{0,3},\\d{2}$") || text.matches("^-?\\d+,\\d{2}$");
  }

  private static boolean isDebitColumn(double xPos) {
    return xPos > 455 && xPos < 470;
  }

  private static String getStringContent(PDDocument doc) throws IOException {
    PDFTextStripper stripper =
        new PDFTextStripper() {
          @Override
          protected void writeString(String text, List<TextPosition> textPositions)
              throws IOException {
            if (isAmount(text)) {
              text = text.replace(" ", "");
              if (isDebitColumn(textPositions.getLast().getEndX())) {
                super.writeString("-");
              }
            }
            super.writeString(text, textPositions);
          }
        };
    stripper.setLineSeparator(LINE_SEPARATOR);
    stripper.setPageEnd(LINE_SEPARATOR);
    return stripper.getText(doc);
  }
}

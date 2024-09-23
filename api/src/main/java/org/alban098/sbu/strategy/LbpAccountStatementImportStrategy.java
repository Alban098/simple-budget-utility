package org.alban098.sbu.strategy;

import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.utils.Currency;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

public class LbpAccountStatementImportStrategy implements AccountStatementImportStrategy {

  private static final String LINE_SEPARATOR = "\n";
  private static final NumberFormat FORMAT = NumberFormat.getInstance(Locale.FRANCE);

  @Override
  public List<Transaction> parseTransactions(PDDocument fileDump, int year) throws ParseException, IOException {

    List<Transaction> transactions = new ArrayList<>();
    String[] content = getStringContent(fileDump).split("Date Opérations Débit");
    for (String transactionArray : content) {
      String[] transactionInfo = transactionArray.split(LINE_SEPARATOR);
      for (int i = 0; i < transactionInfo.length; i++) {
        if (transactionInfo[i].matches("^\\d{2}/\\d{2} .+")) {
          String[] header = transactionInfo[i++].split(" ", 2);
          String[] date = header[0].split("/");
          String description = header[1];
          double amount = 0;
          while (i < transactionInfo.length && !isAmount(transactionInfo[i])) {
            description += transactionInfo[i++];
          }
          if (i < transactionInfo.length && isAmount(transactionInfo[i])) {
            Number number = FORMAT.parse(transactionInfo[i]);
            amount = number.doubleValue();
          }
          Transaction transaction = new Transaction(
                          null,
                          null,
                          LocalDate.of(year, Integer.parseInt(date[1]), Integer.parseInt(date[0])),
                          description);
          transaction.setAmount(Currency.EUR, amount);
          transaction.setId(UUID.randomUUID().toString());
          transactions.add(transaction);
        }
      }
    }
    return transactions;
  }

  private static boolean isAmount(String text) {
    try {
      if (text.matches("^-?(\\d{0,3} )*\\d{0,3},\\d{2}$") || text.matches("^-?\\d+,\\d{2}$")) {
        FORMAT.parse(text);
        return true;
      }
      return false;
    } catch (ParseException e) {
      return false;
    }
  }

  private static boolean isDebitColumn(double xPos) {
    return xPos > 455 && xPos < 470;
  }

  private static String getStringContent(PDDocument doc) throws IOException {
    PDFTextStripper stripper = new PDFTextStripper() {
      @Override
      protected void writeString(String text, List<TextPosition> textPositions) throws IOException
      {
        if (isAmount(text)) {
          text = text.replace(" ", "");
          if (isDebitColumn(textPositions.getLast().getEndX())) {
            writeString("-");
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

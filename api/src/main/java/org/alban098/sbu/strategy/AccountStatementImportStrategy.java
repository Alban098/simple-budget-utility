package org.alban098.sbu.strategy;

import org.alban098.sbu.entity.Transaction;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public interface AccountStatementImportStrategy {

  List<Transaction> parseTransactions(PDDocument fileDump, int year) throws ParseException, IOException;
}

/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.controller;

import java.util.Collection;
import org.alban098.sbu.dto.*;
import org.alban098.sbu.entity.ImportedStatement;
import org.alban098.sbu.service.AccountStatementImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statement")
public class ImportedStatementController {

  private final AccountStatementImportService accountStatementImportService;

  public ImportedStatementController(AccountStatementImportService accountStatementImportService) {
    this.accountStatementImportService = accountStatementImportService;
  }

  @GetMapping("/")
  public ResponseEntity<Collection<ImportedStatementDto>> list() {
    Iterable<ImportedStatement> statements =
        accountStatementImportService.getImportedStatementOfUser();
    return ResponseEntity.ok(accountStatementImportService.createDtos(statements));
  }
}

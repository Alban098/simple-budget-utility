/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.repository;

import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.ImportedStatement;
import org.alban098.sbu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ImportedStatementRepository extends JpaRepository<ImportedStatement, String> {

  @Query("select t from ImportedStatement t where t.account.user = ?1 order by t.date desc")
  Iterable<ImportedStatement> findByUser(User user);

  @Query("select t from ImportedStatement t where t.account = ?1 order by t.date desc")
  Iterable<ImportedStatement> findByAccount(Account user);
}

/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.alban098.sbu.entity.Account;
import org.alban098.sbu.entity.Transaction;
import org.alban098.sbu.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface TransactionRepository extends CrudRepository<Transaction, String> {

  @Query("select t from Transaction t where t.account.user = ?1 order by t.date desc")
  Iterable<Transaction> findByUser(User user);

  @Query("select t from Transaction t where t.account = ?1 order by t.date desc")
  Iterable<Transaction> findByAccount(Account user);

  @Query(
      "select t from Transaction t where t.account = ?1 and t.date between ?2 and ?3 order by"
          + " t.date desc")
  Iterable<Transaction> findByAccountAndDateBetweenOrderByDateAsc(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      "select t from Transaction t where t.account.user = ?1 and t.date between ?2 and ?3 order by"
          + " t.date desc")
  Iterable<Transaction> findByUserAndDateBetweenOrderByDate(
      User user, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      "select t from Transaction t where t.account = ?1 and t.date between ?2 and ?3 order by"
          + " t.date asc LIMIT 1")
  Optional<Transaction> getFirstTransactionOfAccount(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      "select t from Transaction t where t.account = ?1 and t.date between ?2 and ?3 order by"
          + " t.date desc LIMIT 1")
  Optional<Transaction> getLastTransactionOfAccount(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amount amount
          where t.account = ?1 and t.date between ?2 and ?3 and amount.value < 0 and t.category.ignored = false
          order by t.date desc""")
  Iterable<Transaction> findByAccountAndDateBetweenAndAmountsNegativeOrderByDateDesc(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amount amount
          where t.account = ?1 and t.date between ?2 and ?3 and amount.value > 0 and t.category.ignored = false
          order by t.date desc""")
  Iterable<Transaction> findByAccountAndDateBetweenAndAmountsPositiveOrderByDateDesc(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amount amount
          where t.account.user = ?1 and t.date between ?2 and ?3 and amount.value < 0 and t.category.ignored = false
          order by t.date desc""")
  List<Transaction> findByUserAndDateBetweenAndAmountNegativeOrderByDateDesc(
      User user, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amount amount
          where t.account.user = ?1 and t.date between ?2 and ?3 and amount.value > 0 and t.category.ignored = false
          order by t.date desc""")
  List<Transaction> findByUserAndDateBetweenAndAmountPositiveOrderByDateDesc(
      User user, LocalDate dateStart, LocalDate dateEnd);
}

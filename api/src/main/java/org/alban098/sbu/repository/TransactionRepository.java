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

  @Query("select t from Transaction t where t.account.user = ?1 order by t.date")
  Iterable<Transaction> findByUser(User user);

  @Query("select t from Transaction t where t.account = ?1 order by t.date")
  Iterable<Transaction> findByAccount(Account user);

  @Query(
      "select t from Transaction t where t.account = ?1 and t.date between ?2 and ?3 order by"
          + " t.date")
  Iterable<Transaction> findByAccountAndDateBetweenOrderByDateAsc(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      "select t from Transaction t where t.account.user = ?1 and t.date between ?2 and ?3 order by"
          + " t.date")
  Iterable<Transaction> findByUserAndDateBetweenOrderByDateAsc(
      User user, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      "select t from Transaction t where t.account = ?1 and t.date between ?2 and ?3 order by"
          + " t.date LIMIT 1")
  Optional<Transaction> getFirstTransactionOfAccount(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      "select t from Transaction t where t.account = ?1 and t.date between ?2 and ?3 order by"
          + " t.date desc LIMIT 1")
  Optional<Transaction> getLastTransactionOfAccount(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amounts amounts
          where t.account = ?1 and t.date between ?2 and ?3 and amounts.value < 0
          order by t.date""")
  Iterable<Transaction> findByAccountAndDateBetweenAndAmountsNegativeOrderByDateAsc(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amounts amounts
          where t.account = ?1 and t.date between ?2 and ?3 and amounts.value > 0
          order by t.date""")
  Iterable<Transaction> findByAccountAndDateBetweenAndAmountsPositiveOrderByDateAsc(
      Account account, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amounts amounts
          where t.account.user = ?1 and t.date between ?2 and ?3 and amounts.value < 0
          order by t.date""")
  List<Transaction> findByUserAndDateBetweenAndAmountNegativeThanOrderByDateAsc(
      User user, LocalDate dateStart, LocalDate dateEnd);

  @Query(
      """
          select t from Transaction t inner join t.amounts amounts
          where t.account.user = ?1 and t.date between ?2 and ?3 and amounts.value > 0
          order by t.date""")
  List<Transaction> findByUserAndDateBetweenAndAmountPositiveThanOrderByDateAsc(
      User user, LocalDate dateStart, LocalDate dateEnd);
}

/*
 * Copyright (c) 2024, @Author Alban098
 *
 * <== Simple Budget Utility ==>
 *
 * Code licensed under MIT license.
 */
package org.alban098.sbu.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.Collection;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity(name = "user_account")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  private String username;
  private String oicdId;

  @OneToMany(
      cascade = CascadeType.ALL,
      fetch = FetchType.LAZY,
      orphanRemoval = true,
      mappedBy = "user")
  private Collection<Account> accounts = new ArrayList<>();

  public User(String username, String oicdId) {
    this.username = username;
    this.oicdId = oicdId;
  }

  public void removeAccount(Account accounts) {
    this.accounts.remove(accounts);
    accounts.setUser(null);
  }

  public void removeAccounts(Collection<Account> accounts) {
    this.accounts.removeAll(accounts);
    accounts.forEach(t -> t.setUser(null));
  }

  public void addAccount(Account accounts) {
    this.accounts.add(accounts);
    accounts.setUser(this);
  }

  public void addAccounts(Collection<Account> accounts) {
    this.accounts.addAll(accounts);
    accounts.forEach(t -> t.setUser(this));
  }
}

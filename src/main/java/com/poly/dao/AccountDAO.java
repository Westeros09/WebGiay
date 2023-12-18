package com.poly.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;

import com.poly.entity.Account;

public interface AccountDAO extends JpaRepository<Account, String> {
	@Query("SELECT DISTINCT ar.account  FROM Authority ar WHERE ar.role.id IN ('ADMI','CUST')")
	List<Account> getAdministrators();

	Account findByUsername(String username);
	Account findByUsernameIgnoreCase(String username);
	Optional<Account> findByEmail(String email);
	@Query("SELECT a FROM Account a WHERE a.email LIKE ?1")
	Account getAccountByEmail(String email);
	
//	 List<Account> findByEmail(String email);
	 public boolean existsByusername(String username);

	@Procedure
    void DeleteAccountAndRelatedData(String username);
}

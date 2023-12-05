package com.poly.service;

import java.util.List;
import java.util.Optional;

import com.poly.entity.Account;
import com.poly.entity.Order;
import com.poly.entity.Product;


public interface AccountService {
	public List<Account> findAll() ;
	public Account findById(String username) ;
	
	public List<Account> getAdministrators() ;
	 public boolean changePassword(Account account, String oldPassword, String newPassword,String newPasswordAgain);
	 public boolean updateProfile(String username, String newFullname, String newEmail, String photo);
	 public boolean updateProfileWithoutPhoto(String username, String newFullname, String newEmail);
	 public Account getCurrentAccount();
	 public void deleteAddressesByAccount(Account account);
	 public List<Account> findAllWithPasswordEncoder();
	 public Account update(Account account) ;
	 public Account create(Account account);
	 public void delete(String username);
	 Account findByEmail(String email);
	 public List<String> findAllAccountEmails();
	 public boolean isEmailExists(String email);
	 public void deleteAccountAndRelatedData(String username);
	 public String generateRandomPassword();

}

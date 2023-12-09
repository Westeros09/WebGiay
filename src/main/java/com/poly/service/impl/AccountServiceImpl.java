package com.poly.service.impl;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import javax.security.auth.login.AccountNotFoundException;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.poly.dao.AccountDAO;
import com.poly.dao.AddressDAO;
import com.poly.dao.OrderDAO;
import com.poly.dao.OrderDetailDAO;
import com.poly.entity.Account;
import com.poly.entity.Address;
import com.poly.entity.Order;
import com.poly.entity.OrderDetail;
import com.poly.entity.Product;
import com.poly.service.AccountService;
import com.poly.service.OrderService;
import com.poly.service.ProductService;


@Service
public class AccountServiceImpl implements AccountService{
	@Autowired
	AccountDAO dao;
	@Autowired
	BCryptPasswordEncoder passwordEncoder;
	@Autowired
	AddressDAO addressdao;
	@Autowired
    OrderDAO orderDAO;
	@Autowired
	OrderService OrderService;
	@Autowired
	OrderDetailDAO orderdetailDAO;
	@Autowired
	ProductService productService;
	public List<Account> findAll() {
		return dao.findAll();
	}

	public Account findById(String username) {
		return dao.findById(username).get();
	}

	public List<Account> getAdministrators() {
		return dao.getAdministrators();
	}
	@Override
	public boolean changePassword(Account account, String oldPassword, String newPassword,String newPasswordAgain) {
		if ((newPassword.equalsIgnoreCase(newPasswordAgain)) && (oldPassword.equals(account.getPassword()))) {
            account.setPassword(newPassword);
            dao.save(account);
            return true;
        }
        return false;
    }

	@Override
	public boolean updateProfile(String username, String newFullname, String newEmail, String photo) {
		Account account = dao.findById(username).orElse(null);

        if (account != null) {
            account.setFullname(newFullname);
            account.setEmail(newEmail);
            account.setPhoto(photo);
            dao.save(account);
            return true;
        }

        return false;
    }
	@Override
	public Account getCurrentAccount() {
		 Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        String username = authentication.getName();
	        return dao.findByUsername(username);
	}

	 @Override
	    public Account update(Account account) {
	        return dao.save(account);
	    }

	@Override
	public Account create(Account account) {
		// TODO Auto-generated method stub
		
		return dao.save(account);
	}

	@Override
	public void delete(String username) {
		// TODO Auto-generated method stub
		dao.deleteById(username);
	}
	
	@Override
	public boolean updateProfileWithoutPhoto(String username, String newFullname, String newEmail) {
		Account account = dao.findById(username).orElse(null);

        if (account != null) {
      
            account.setFullname(newFullname);
            account.setEmail(newEmail);
            dao.save(account);
            return true;
        }

        return false;
    }
	
	@Override
	public List<Account> findAllWithPasswordEncoder() {
	    List<Account> accounts = dao.findAll();
	    for (Account account : accounts) {
	        String email = account.getEmail();
	        String salt = BCrypt.gensalt(10);
	        String encryptedPassword = passwordEncoder.encode(email + salt);
	        account.setPassword(encryptedPassword.substring(Math.max(0, encryptedPassword.length() - 7)));
	    }

	    return accounts;
	}
	


	@Override
	 public void deleteAddressesByAccount(Account account) {
        List<Address> addressesToDelete = addressdao.findByAccount(account);
        for (Address address : addressesToDelete) {
        	addressdao.delete(address);
        }
    }

	@Override
	@Transactional
	public void deleteAccountAndRelatedData(String username) {
		dao.DeleteAccountAndRelatedData(username);

	}

	@Override
    public Account findByEmail(String email) {
        return dao.getAccountByEmail(email);
    }

	@Override
    public List<String> findAllAccountEmails() {
        List<Account> accounts = dao.findAll(); 
        List<String> emails = accounts.stream().map(Account::getEmail).collect(Collectors.toList()); 
        return emails;
    }
	
	@Override
	public boolean isEmailExists(String email) {
	    List<Account> accounts = dao.findAll();
	    for (Account account : accounts) {
	        if (email.equals(account.getEmail())) {
	            return true;
	        }
	    }
	    return false;
	}
	@Override
	public String generateRandomPassword() {
	    Random random = new Random();
	    int newPassword = random.nextInt(900000) + 100000;
	    return String.valueOf(newPassword);
	}
	
}

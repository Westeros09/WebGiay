package com.poly.service.impl;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
		// TODO Auto-generated method stub
		 List<Account> accounts = dao.findAll();
		 accounts.sort(Comparator.comparing(Account::getUsername));
	        for (Account account : accounts) {
	        String encryptedPassword = passwordEncoder.encode(account.getPassword());
	   	    account.setPassword(encryptedPassword.substring(0, 9));
	        }
	        Collections.reverse(accounts);
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
	            return true; // Email đã tồn tại trong hệ thống
	        }
	    }
	    return false; // Email chưa tồn tại
	}

	
	
}

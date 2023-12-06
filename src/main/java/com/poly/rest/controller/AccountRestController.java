package com.poly.rest.controller;

import java.io.File;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.poly.dao.OrderDAO;
import com.poly.entity.Account;
import com.poly.entity.Authority;
import com.poly.entity.Image;
import com.poly.entity.MailInfo;
import com.poly.entity.Order;
import com.poly.entity.Product;
import com.poly.service.AccountService;
import com.poly.service.AuthorityService;
import com.poly.service.ImageService;
import com.poly.service.MailerService;
import com.poly.service.OrderService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/accounts")
public class AccountRestController {
	@Autowired
	AccountService accountService;
	@Autowired
	ImageService imageService;
	@Autowired
	AuthorityService authorityService;

	@Autowired
    OrderDAO OrderDAO;
	@Autowired
	OrderService OrderService;
	@Autowired
	JavaMailSender emailSender;
	@Autowired
	MailerService mailerService;
	@GetMapping
	public List<Account> getAccounts() {
	    return accountService.findAllWithPasswordEncoder();
	}
	 
	@GetMapping("{username}")
	public Account getOne(@PathVariable("username") String username) {
		return accountService.findById(username);
	}
	
	@PutMapping("{username}")
	public Account put(@PathVariable("username") String username, @RequestBody Account account) {
		return accountService.update(account);
	}
	
	@DeleteMapping("{username}")
	public void delete(@PathVariable("username") String username) {
	    accountService.deleteAccountAndRelatedData(username);
	}


	@PostMapping
	public Account post(@RequestBody Account account) {   
      accountService.create(account);
	    return account;  
	}

	
	@GetMapping("/current-account")
	public ResponseEntity<Account> getCurrentAccount() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String username = authentication.getName();
	    Account account = accountService.findById(username);
	    if (account != null) {
	        return new ResponseEntity<>(account, HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}
	
	@PostMapping("/sendEmail")
	public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> requestData) {
	    String userEmail = requestData.get("email");
	    Account account = accountService.findByEmail(userEmail);
	    if (account != null) {
	    	double randomDouble = Math.random();
            randomDouble = randomDouble * 1000 + 1;
            int newPassword = (int) randomDouble;
	        account.setPassword(String.valueOf(newPassword));
	        accountService.update(account);
	        MailInfo mail = new MailInfo(account.getEmail(), "Mật khẩu mới", "Hi " + account.getUsername() + ", mật khẩu mới của bạn là: " + newPassword);
	        try {
	            mailerService.send(mail);
	            return ResponseEntity.ok("Mật khẩu mới đã được gửi đến địa chỉ email của bạn.");
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Mật khẩu mới đã được gửi đến địa chỉ email của bạn.");
	        }
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài khoản với địa chỉ email này.");
	    }
	}




}

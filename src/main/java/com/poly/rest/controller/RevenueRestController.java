package com.poly.rest.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dao.OrderDAO;
import com.poly.entity.Account;
import com.poly.entity.Order;
import com.poly.entity.Product;
import com.poly.entity.RevenueItem;
import com.poly.service.AccountService;


@CrossOrigin("*")
@RestController
@RequestMapping("/rest/revenue")
public class RevenueRestController {
	@Autowired
	OrderDAO dao;
	
	@GetMapping
	public List<Integer> getAllYear() {
		return dao.findByYear();
	}
	
	@GetMapping("{year}")
	public List<Object[]> showRevenueByYear(@PathVariable(value = "year", required = false) Integer year) {
		return dao.findByDoanhThuNam(year);
	}
	
	@GetMapping("/today")
	public Double getDailyRevenue() {
	   
	    return dao.getTotalRevenueToday(); 
	}
}

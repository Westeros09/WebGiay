package com.poly.rest.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dao.CategoryDAO;
import com.poly.dao.OrderDAO;
import com.poly.dao.OrderDetailDAO;
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
	@Autowired
	OrderDetailDAO orderDetailDAO;
	@Autowired
	CategoryDAO categoryDAO;

	@GetMapping
	public List<Integer> getAllYear() {
		return dao.findByYear();
	}

	@GetMapping("{year}")
	public List<Object[]> showRevenueByYear(@PathVariable(value = "year", required = false) Integer year) {
		return dao.findByDoanhThuNam(year);
	}

	// 4 bảng trong admin
	// BẢNG 1
	@GetMapping("/today")
	public Double getDailyRevenue() {
		LocalDate currentDate = LocalDate.now();
		return dao.getTotalRevenueForDate(currentDate);
	}

	@GetMapping("/yesterday")
	public Double getYesterdayRevenue() {
		// Lấy ngày hôm qua
		LocalDate yesterday = LocalDate.now().minusDays(1);
		return dao.getTotalRevenueForDate(yesterday);
	}

	// BÀNG 2
	@GetMapping("/saleVolume")
	public Integer getsaleVolume() {
		// Lấy LocalDate cho ngày hiện tại
		LocalDate currentDate = LocalDate.now();
		// Lấy YearMonth cho tháng và năm hiện tại
		YearMonth currentYearMonth = YearMonth.from(currentDate);
		return orderDetailDAO.getTotalQuantitySoldThisMonth(currentYearMonth.getMonthValue(),
				currentYearMonth.getYear());
	}

	@GetMapping("/saleVolumePrevious")
	public Integer getsaleVolumePrevious() {
		LocalDate currentDate = LocalDate.now();
		YearMonth currentYearMonth = YearMonth.from(currentDate);
		return orderDetailDAO.getTotalQuantitySoldThisMonth(currentYearMonth.minusMonths(1).getMonthValue(),
				currentYearMonth.getYear());
	}

	// BẢNG 3
	@GetMapping("/averageOrderValue")
	public Double AverageOrderValue() {
		// Lấy ngày đầu tháng hiện tại
		LocalDate startDate = LocalDate.now().withDayOfMonth(1);
		// Lấy ngày đầu tháng sau
		LocalDate endDate = startDate.plusMonths(1);
		System.out.println("Start Date: " + startDate);
	    System.out.println("End Date: " + endDate);
		return dao.AverageOrderValue(startDate, endDate);
	}
	@GetMapping("/averageOrderValuePrevious")
	public Double AverageOrderValuePrevious() {
		// Lấy ngày đầu tháng hiện tại
		LocalDate startDate = LocalDate.now().minusMonths(1).withDayOfMonth(1);
		// Lấy ngày đầu tháng sau
		LocalDate endDate = startDate.plusMonths(1);
		System.out.println("Start Date PRE: " + startDate);
	    System.out.println("End Date PRE: " + endDate);
	    return dao.AverageOrderValue(startDate, endDate);
	}

	@GetMapping("/revenueYear")
	public Double getRevenueYear() {
		return dao.getTotalRevenueThisYear();
	}

	// BẢNG CATEGORY
	@GetMapping("/totalQuantityByCategory")
	public List<Object[]> getTotalQuantityByCategory() {
		return categoryDAO.getTotalQuantityByCategoryNative();
	}

	@GetMapping("/totalQuantitySoldByCategory")
	public List<Object[]> getTotalQuantitySoldByCategory() {
		return categoryDAO.getTotalQuantitySoldByCategoryNative();
	}

	// BẢNG CITY
	@GetMapping("/city")
	public List<Object[]> getCity() {
		return dao.getCityOrderStatistics();
	}
}

package com.poly.rest.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.poly.entity.DiscountProduct;

import com.poly.service.DiscountProductService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/discountProduct")
public class DiscountProductRestController {
	@Autowired
	DiscountProductService discountProductService;

	@GetMapping
	public List<DiscountProduct> getAll() {
		return discountProductService.findAll();
	}

	@GetMapping("{id}")
	public DiscountProduct getOne(@PathVariable("id") Integer id) {

		return discountProductService.findById(id);
	}

	@PostMapping
	public DiscountProduct post(@RequestBody DiscountProduct discountProduct) {
		discountProductService.create(discountProduct);
		return discountProduct;
	}

	@PutMapping("{id}")
	public DiscountProduct DiscountProduct(@PathVariable("id") Integer id,
			@RequestBody DiscountProduct discountProduct) {
		return discountProductService.update(discountProduct);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable("id") Integer id) {
		discountProductService.deleteDiscountCode(id);
		discountProductService.delete(id);
	}

	@GetMapping("/dateRange/{startDate}/{endDate}")
	public List<DiscountProduct> findDiscountProductsInDateRange(
	        @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
	        @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
	    return discountProductService.findDiscountProductsInDateRange(startDate, endDate);
	}



}

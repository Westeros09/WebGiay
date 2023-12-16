package com.poly.service;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.entity.DiscountProduct;
import com.poly.entity.Image;



public interface DiscountProductService {
	public List<DiscountProduct> findAll();

	public DiscountProduct create(JsonNode DiscountProduct);

	public DiscountProduct findById(Integer id);

	public DiscountProduct create(DiscountProduct discountProduct);

	public List<DiscountProduct> findByCode(Integer id);

	public DiscountProduct update(DiscountProduct discountProduct);

	public void delete(Integer id);

	public void deleteDiscountCode(Integer id);
	
	
	
	public List<DiscountProduct> findByIdProductDiscount(Integer productId);
	
	 
	public List<DiscountProduct> findDiscountProductsInDateRange (LocalDate startDate, LocalDate endDate);
}

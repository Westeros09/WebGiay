package com.poly.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.dao.DiscountProductDAO;
import com.poly.entity.DiscountProduct;
import com.poly.service.DiscountProductService;

@Service
public class DiscountProductServiceImpl implements DiscountProductService {
	@Autowired
	DiscountProductDAO discountProductDAO;

	@Override
	public List<DiscountProduct> findAll() {
		return discountProductDAO.findAll();
	}

	
	
	@Override
	public DiscountProduct create(JsonNode DiscountProduct) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public DiscountProduct findById(Integer id) {
		// TODO Auto-generated method stub
		return discountProductDAO.findById(id).get();
	}

	@Override
	public DiscountProduct create(DiscountProduct discountProduct) {
		// TODO Auto-generated method stub
		return discountProductDAO.save(discountProduct);
	}

	@Override
	public List<DiscountProduct> findByCode(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public DiscountProduct update(DiscountProduct discountProduct) {
		// TODO Auto-generated method stub
		return discountProductDAO.save(discountProduct);
	}

	@Override
	public void delete(Integer id) {
		discountProductDAO.deleteById(id);

	}

	@Override
	public void deleteDiscountCode(Integer id) {
		// TODO Auto-generated method stub

	}

 

	@Override
	public List<DiscountProduct>  findByIdProductDiscount(Integer productId) {
		// TODO Auto-generated method stub
		return discountProductDAO.findByIdProductDiscount(productId);
	}



	@Override
	public List<DiscountProduct> findDiscountProductsInDateRange(LocalDate startDate, LocalDate endDate) {
		return discountProductDAO.findDiscountProductsInDateRange(startDate, endDate);
	}




}

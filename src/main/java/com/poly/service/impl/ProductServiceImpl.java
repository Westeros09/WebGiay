package com.poly.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dao.ProductDAO;
import com.poly.entity.Product;
import com.poly.service.ProductService;


@Service
public class ProductServiceImpl implements ProductService{
	@Autowired
	ProductDAO dao;

	public List<Product> findAll() {
		return dao.findAll();
	}
	
	public Product findById(Integer id) {
		return dao.findById(id).get();
	}

	public List<Product> findByCategoryId(String cid) {
		return dao.findByCategoryId(cid);
	}

	public Product create(Product product) {
		return dao.save(product);
	}

	public Product update(Product product) {
		return dao.save(product);
	}

	public void delete(Integer id) {
		dao.deleteById(id);
	}

	public List<Product> sortProductASC(){
		return dao.sortProductAS();
	}
	
	public List<Product> sortProductDesc(){
		return dao.sortProductDesc();
	}
	
	public List<Product> sortPriceLowToHight(){
		return dao.sortPriceLowToHight();
	}
	public List<Product> sortPriceHightToLow(){
		return dao.sortPriceHightToLow();
	}
}
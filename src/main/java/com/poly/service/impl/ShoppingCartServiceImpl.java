package com.poly.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dao.ShoppingCartDAO;
import com.poly.entity.ShoppingCart;
import com.poly.service.ShoppingCartService;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

	@Autowired
	private ShoppingCartDAO shoppingCartDAO;

	@Override
	public List<ShoppingCart> findAll() {
		return shoppingCartDAO.findAll();
	}

	@Override
	public ShoppingCart findById(int id) {
		return shoppingCartDAO.findById(id).orElse(null);
	}

	@Override
	public void save(ShoppingCart shoppingCart) {
		shoppingCartDAO.save(shoppingCart);
	}

	@Override
	public void deleteById(int id) {
		shoppingCartDAO.deleteById(id);
	}

	@Override
	public List<ShoppingCart> findByUsername(String username) {
		return shoppingCartDAO.findShoppingCartsByUsername(username);
	}

	@Override
	public void update(ShoppingCart shoppingCart) {
		shoppingCartDAO.save(shoppingCart);
	}

	@Override
	public ShoppingCart findByProductIdAndUsernameAndSize(Integer id, String username, Integer size) {
		return shoppingCartDAO.findShoppingCartByProductIdAndUsernameAndSize(id, username, size);
	}

	@Override
	public void deleteAllByUsername(String username) {
		shoppingCartDAO.deleteByAccount_Username(username);
		
	}

}
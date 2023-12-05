package com.poly.service;

import java.util.List;
import com.poly.entity.ShoppingCart;

public interface ShoppingCartService {
	List<ShoppingCart> findAll();

	ShoppingCart findById(int id);

	void save(ShoppingCart shoppingCart);

	void deleteById(Integer id);

	void deleteAll(String username);

	void update(ShoppingCart shoppingCart);

	List<ShoppingCart> findByUsername(String username);

	ShoppingCart findByProductIdAndUsernameAndSize(Integer id, String username, Integer size);

	void deleteShoppingCartByUserAndStatus(String username);

	boolean allProductsAreFalse(String username);
}
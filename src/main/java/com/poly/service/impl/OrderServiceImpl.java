package com.poly.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.dao.OrderDAO;
import com.poly.dao.OrderDetailDAO;
import com.poly.entity.Account;
import com.poly.entity.Order;
import com.poly.entity.OrderDetail;
import com.poly.entity.Product;
import com.poly.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService{
	
	@Autowired
	OrderDAO dao;
	@Autowired
	OrderDetailDAO detaildao;
	@Autowired
	OrderService OrderService;
	@Override
	public List<Order> findAll() {
		return dao.findAll();
	}

	@Override
	public Order create(JsonNode orderData) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Order findById(Long id) {
		return dao.findById(id).get();
	}

	@Override
	public List<Order> findByUsername(String username) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void delete(Long id) {
		dao.deleteById(id);
	}

	@Override
	public Order update(Order order) {
		return dao.save(order);
	}
	
	public boolean hasOrders(String username) {
        // Kiểm tra xem có đơn hàng nào của người dùng có username không
        return dao.existsByAccount_Username(username);
    }
	@Override
	public void deleteOrderDetailByOrderId(Long id) {
		// TODO Auto-generated method stub
		detaildao.deleteById(id);
	}
	@Override
	public List<Order> getCurrentUserOrders() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return dao.findByAccountUsername(username);
	}

	@Override
	public List<OrderDetail> getDetailDataById(Long id) {
		// TODO Auto-generated method stub
		return detaildao.findByOrderDetailId(id);
	}

	@Override
	public List<Object[]> getShippedOrdersForCurrentAccount(String username) {
		// TODO Auto-generated method stub
		return dao.findShippedOrdersByAccount(username);
	}

	@Override
	public List<Object[]> getUnshippedOrdersForCurrentAccount(String username) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	@Override
	public List<Order> findOrdersByAccount(String username) {
        return dao.findOrdersByAccount_Username(username);
    }

	


	
	
	
	
}
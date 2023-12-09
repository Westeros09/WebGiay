package com.poly.rest.controller;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.poly.dao.CategoryDAO;
import com.poly.dao.OrderDAO;
import com.poly.dao.OrderDetailDAO;
@SpringBootTest
class RevenueRestControllerTest {
	@Autowired
	OrderDAO dao;
	@Autowired
	OrderDetailDAO orderDetailDAO;
	@Autowired
	CategoryDAO categoryDAO;

	@Test
	public void testGetAllYear() {
		Integer[] expect = { 2021, 2023 }; // Sử dụng Integer[] thay vì int[] để làm việc với List<Integer>
		List<Integer> result = dao.findByYear();
		assertEquals(Arrays.asList(expect), result);
	}

}

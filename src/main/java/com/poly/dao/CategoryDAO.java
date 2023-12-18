package com.poly.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.poly.entity.Category;
import com.poly.entity.Product;

public interface CategoryDAO extends JpaRepository<Category, String> {
	@Query("SELECT SUM(p.quantity) FROM Category c JOIN c.products p WHERE c.name = ?1")
	Long countProductsByCategory(String categoryName);

	@Query(value = "SELECT c.name, SUM(s.quantity)" 
			+ "FROM Categories c "
			+ "LEFT JOIN Products p ON c.id = p.category_id " + "LEFT JOIN Sizes s ON p.id = s.product_id "
			+ "GROUP BY c.name, c.id " + "ORDER BY c.name", nativeQuery = true)
	List<Object[]> getTotalQuantityByCategoryNative();

	@Query(value = "SELECT c.name, SUM(od.quantity)" 
			+ "FROM Categories c "
			+ "LEFT JOIN Products p ON c.id = p.category_id " 
			+ "LEFT JOIN OrderDetails od ON p.id = od.product_id "
			+ "LEFT JOIN Orders o ON od.order_id = o.id "
			+ "WHERE o.status = N'Đã Giao' "
			+ "GROUP BY c.name, c.id " + "ORDER BY c.name", nativeQuery = true)
	List<Object[]> getTotalQuantitySoldByCategoryNative();
}

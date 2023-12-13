package com.poly.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.poly.entity.Order;
import com.poly.entity.OrderDetail;
@Repository
public interface OrderDetailDAO extends JpaRepository<OrderDetail, Long> {

	@Query("SELECT o FROM OrderDetail o WHERE o.order.id=?1")
	List<OrderDetail> findByOrderDetailId(Long id);
	
	
	@Query(value="SELECT TOP 4 p.id, p.name, p.price, p.quantity, p.available, p.category_id, SUM(od.quantity) AS total_quantity_sold FROM Products p JOIN orderdetails od ON p.id = od.product_id GROUP BY p.id, p.name, p.price, p.quantity, p.available, p.category_id ORDER BY total_quantity_sold DESC", nativeQuery = true)
	List<Object[]> findByAllTopProductOrderDetail();

	// Tổng số lượng sản phẩm bán ra trong tháng
	@Query(value = "SELECT SUM(od.quantity) FROM OrderDetails od " 
			+ "JOIN Orders o ON od.order_id = o.id "
			+ "WHERE MONTH(o.create_date) = ?1 AND YEAR(o.create_date) = ?2", nativeQuery = true)
	Integer getTotalQuantitySoldThisMonth(Integer month, Integer year);
	
	@Transactional
	List<OrderDetail> findByOrder(Order order);
	

}

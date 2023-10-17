package com.poly.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.poly.entity.Order;
import com.poly.entity.Product;

public interface OrderDAO extends JpaRepository<Order, Long> {
	@Query("SELECT o FROM Order o WHERE o.account.username=?1")
	List<Order> findByUsername(String username);

	@Query(value = "select year(create_date)" + " from orders" + " group by year(create_date)", nativeQuery = true)
	List<Integer> findByYear();

	@Query(value = "select MONTH(o.create_date) as month, SUM(o.tongtien) as totalRevenue" + " from orders o"
			+ " where YEAR(o.create_date) = ?1" + " group by MONTH(o.create_date)", nativeQuery = true)
	List<Object[]> findByDoanhThuNam(int year);

	@Query("SELECT o FROM Order o ORDER BY o.createDate DESC")
	List<Order> findAllOrderByCreateDateDesc();

	List<Order> findByAccountUsername(String username);

//	@Query("SELECT SUM(o.tongtien) FROM Order o WHERE DATE(o.createDate) = DATE(NOW())")
	@Query("SELECT SUM(o.tongtien) FROM Order o WHERE CONVERT(date, o.createDate) = CONVERT(date, CURRENT_TIMESTAMP)")
	Double getTotalRevenueToday();
}

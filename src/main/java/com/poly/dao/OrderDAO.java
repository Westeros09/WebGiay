package com.poly.dao;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.Account;
import com.poly.entity.Order;
import com.poly.entity.OrderDetail;
import com.poly.entity.Product;

@Repository
public interface OrderDAO extends JpaRepository<Order, Long> {
	@Query("SELECT o FROM Order o WHERE o.account.username=?1")
	List<Order> findByUsername(String username);

	@Query(value = "select year(create_date)" + " from orders" + " group by year(create_date)", nativeQuery = true)
	List<Integer> findByYear();

	@Query(value = "select MONTH(o.create_date) as month, SUM(o.tongtien) as totalRevenue" + " from orders o"
			+ " where YEAR(o.create_date) = ?1 AND o.status = N'Đã Giao'" + " group by MONTH(o.create_date)  ", nativeQuery = true)
	List<Object[]> findByDoanhThuNam(int year);

	@Query("SELECT o FROM Order o ORDER BY o.createDate DESC")
	List<Order> findAllOrderByCreateDateDesc();

	List<Order> findByAccountUsername(String username);

	//// Tổng doannh thu hôm nay
//	@Query("SELECT SUM(o.tongtien) FROM Order o WHERE CONVERT(date, o.createDate) = CONVERT(date, CURRENT_TIMESTAMP)")
//	Double getTotalRevenueToday();

//	@Query("SELECT SUM(o.tongtien) FROM Order o WHERE CONVERT(date, o.createDate) = CONVERT(date, ?1) ")
	@Query(value = "SELECT SUM(o.tongtien) FROM Orders o WHERE CONVERT(date, o.create_date) = CONVERT(date, ?1 )  AND o.status = N'Đã Giao'", nativeQuery = true)
	Double getTotalRevenueForDate(LocalDate myDate);

	// AOV	
	@Query(value = "SELECT ROUND( CASE " 
			+ "    WHEN COUNT(*) > 0 THEN SUM(tongtien) / COUNT(*) " 
			+ "    ELSE 0 "
			+ "END, 2)" + "FROM Orders o " + "WHERE o.create_date >= ?1 AND o.create_date < ?2 AND o.status = N'Đã Giao'"
			, nativeQuery = true)
	Double AverageOrderValue(LocalDate startDate, LocalDate endDate);

	// Tổng doannh thu năm nay
	@Query(value = "SELECT ROUND( SUM(tongtien), 2) FROM Orders WHERE YEAR(create_date) = YEAR(GETDATE()) ", nativeQuery = true)
	Double getTotalRevenueThisYear();
	@Query(value = "SELECT CASE WHEN SUM(tongtien) IS NOT NULL THEN ROUND(SUM(tongtien), 2) ELSE 0 END FROM Orders o WHERE YEAR(create_date) = ?1  AND o.status = N'Đã Giao'", nativeQuery = true)
	Double getTotalRevenueThisYear(int year);


	// Phan tich city
	@Query(value = "SELECT TOP 5 o.city AS cityName, SUM(o.tongtien) AS totalSales, COUNT(o.id) AS orderCount, ROUND( SUM(o.tongtien)/COUNT(o.id) , 2) AS aov "
			+ "FROM Orders o " + "WHERE o.city IS NOT NULL AND o.status = N'Đã Giao'" + "GROUP BY o.city " + "ORDER BY totalSales DESC"

			, nativeQuery = true)

	List<Object[]> getCityOrderStatistics();

	@Query(value = "SELECT o.id as order_id, o.username, o.tongtien, od.id as order_detail_id, od.quantity,od.size, p.name, p.price,p.id "
			+ "FROM Orders o " + "INNER JOIN OrderDetails od ON o.id = od.order_id "
			+ "INNER JOIN Products p ON od.product_id = p.id " + "WHERE o.username = ?1 AND o.available = 1 "
			+ "order by o.id DESC;", nativeQuery = true)
	List<Object[]> findShippedOrdersByAccount(String username);

	@Query(value = "SELECT distinct o.id as order_id, o.username, o.tongtien, od.id as order_detail_id, od.quantity,od.size,p.id, p.name, p.price "
			+ "FROM Orders o " + "INNER JOIN OrderDetails od ON o.id = od.order_id "
			+ "INNER JOIN Products p ON od.product_id = p.id " + "WHERE o.username = ?1 AND o.available = 0 "
			+ "order by o.id DESC;", nativeQuery = true)
	List<Object[]> findUnshippedOrdersByAccount(String username);

	boolean existsByAccount_Username(String username);

	@Transactional
	List<Order> findOrdersByAccount_Username(String username);

}

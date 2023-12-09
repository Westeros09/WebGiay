package com.poly.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.poly.entity.DiscountProduct;

import com.poly.entity.Product;


public interface DiscountProductDAO extends JpaRepository<DiscountProduct, Integer> {
	List<DiscountProduct> findByProduct(Product product);

	@Query("SELECT p FROM DiscountProduct p where p.product.id = ?1")
	List<DiscountProduct> findByIdProduct(Integer keywords);
	
	
	@Query("SELECT i FROM DiscountProduct i WHERE i.product.id = :productId")
	List<DiscountProduct>  findByIdProductDiscount(Integer productId);
	
	
	   @Query("SELECT p FROM DiscountProduct p WHERE p.start_Date <= :endDate AND p.end_Date >= :startDate")
	    List<DiscountProduct> findDiscountProductsInDateRange(
	        @Param("startDate") LocalDate startDate,
	        @Param("endDate") LocalDate endDate
	    );
}

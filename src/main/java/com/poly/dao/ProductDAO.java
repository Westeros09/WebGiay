package com.poly.dao;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.web.context.annotation.SessionScope;

import com.poly.entity.Product;
import com.poly.entity.Report;

@SessionScope
public interface ProductDAO extends JpaRepository<Product, Integer> {

	@Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice ORDER BY p.price ASC")
	Page<Product> findByPriceBetween(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice,
			Pageable pageable);

	@Query("SELECT o FROM Product o WHERE o.category.name LIKE ?1 and o.available = True ")
	Page<Product> findByBrand(String brand, Pageable pageable);

	// tim kiem
	@Query("SELECT o FROM Product o WHERE o.name LIKE ?1 and o.available = True")
	Page<Product> findByKeywords(String keywords, Pageable pageable);
	//Sắp xếp
	@Query("SELECT o FROM Product o WHERE o.available = True")
	Page<Product> findBySort( Pageable pageable);

	@Query("SELECT new Report(o.category.name, sum(o.price), count(o) )" + " FROM Product o"
			+ " GROUP BY o.category.name" + " ORDER BY sum(o.price) DESC")
	List<Report> getInventoryByCategory();

	@Query("SELECT p FROM Product p  LEFT JOIN p.discountProduct dp")
	Page<Product> findAllProductsAndDiscounts(Pageable pageable);

	@Query("SELECT p FROM Product p WHERE p.category.id=?1 and p.available = True")
	List<Product> findByCategoryId(String cid);

	@Query("SELECT p FROM Product p WHERE p.available = 'true' ORDER BY p.name ASC ")
	List<Product> sortProductAS();

	@Query("SELECT p FROM Product p WHERE p.available = 'true' ORDER BY p.name Desc")
	List<Product> sortProductDesc();

	@Query("SELECT p FROM Product p WHERE p.available = 'true' ORDER BY p.price ASC")
	List<Product> sortPriceLowToHight();

	@Query("SELECT p FROM Product p WHERE p.available = 'true' ORDER BY p.price DESC")
	List<Product> sortPriceHightToLow();

	@Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = 'M' and p.available = True")
	Integer countMlBProducts();

	@Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = 'AD' and p.available = True")
	Integer countADProducts();

	@Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = 'NK' and p.available = True")
	Integer countNKProducts();

// hàm COALESCE sẽ đặt giá trị là 0 thay vì NULL. Điều này đảm bảo rằng ngay cả khi không có sản phẩm, số lượng sẽ vẫn là 0.
	@Query("SELECT c.name, COALESCE(COUNT(p), 0), c.available FROM Category c LEFT JOIN Product p ON c.id = p.category.id AND p.available = true GROUP BY c.name, c.available")
	List<Object[]> countProductsByCategory();

	@Query(value = "SELECT * FROM Products WHERE Products.available = 'true' ORDER BY NEWID()", nativeQuery = true)

	List<Product> topProduct();

	@Query(value = "SELECT TOP 4 * FROM products WHERE Products.available = 'true' ORDER BY products.id DESC", nativeQuery = true)
	List<Product> NewProduct();

	@Query(value = "SELECT p FROM Product p WHERE p.available = true ORDER BY p.id DESC")
	Page<Product> findNewProducts(Pageable pageable);

	@Query(value = "SELECT p.id, p.name, SUM(s.quantity) FROM Products p INNER JOIN Sizes s ON p.id = s.product_id GROUP BY p.id, p.name", nativeQuery = true)
	List<Object[]> getProductQuantity();

//	@Query(value = "SELECT p.id, p.category_id,p.name,p.price,d.percentage from Products p\r\n"
//			+ "inner join discount_Sales d on d.id = p.sale_id",nativeQuery = true)
//	List<Product> findByDiscount();

	@Query("SELECT p FROM Product p WHERE p.available = True")
	Page<Product> findDelete(Pageable pageable);
	
	@Procedure
    void DeleteProductAndRelatedData(Integer id);

	/*
	 * @Query(value =
	 * "SELECT DISTINCT p FROM Product p JOIN p.sizes s WHERE s.size IN :sizeList",
	 * countQuery =
	 * "SELECT COUNT(DISTINCT p) FROM Product p JOIN p.sizes s WHERE s.size IN :sizeList"
	 * ) Page<Product> findProductsBySize(@Param("sizeList") List<Integer> sizeList,
	 * Pageable pageable);
	 */
	@Query("SELECT DISTINCT p FROM Product p JOIN p.sizes s WHERE s.sizes IN (36, 37, 38)")
	Page<Product> findProductsBySize36To38(Pageable pageable);

	@Query("SELECT DISTINCT p FROM Product p JOIN p.sizes s WHERE s.sizes IN (40, 41, 42)")
	Page<Product> findProductsBySize40To42(Pageable pageable);

	@Query("SELECT DISTINCT p FROM Product p JOIN p.sizes s WHERE s.sizes IN (42, 43, 44)")
	Page<Product> findProductsBySize42To44(Pageable pageable);

	@Query(value = "SELECT distinct p.* FROM Products p JOIN Sizes s ON p.id = s.product_id WHERE s.size IN (36,37,38) ", nativeQuery = true)
	Page<Product> findProductSizeSmall(Pageable pageable);

	@Query(value = "SELECT distinct p.* FROM Products p JOIN Sizes s ON p.id = s.product_id WHERE s.size IN (40,41,42) ", nativeQuery = true)
	Page<Product> findProductSizeMedium(Pageable pageable);

	@Query(value = "SELECT distinct p.* FROM Products p JOIN Sizes s ON p.id = s.product_id WHERE s.size IN (42,43,44) ", nativeQuery = true)
	Page<Product> findProductSizeLarge(Pageable pageable);

}

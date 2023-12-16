package com.poly.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.poly.dao.DiscountProductDAO;
import com.poly.dao.ImageDAO;
import com.poly.dao.OrderDAO;
import com.poly.dao.OrderDetailDAO;
import com.poly.dao.ProductDAO;

import com.poly.dao.ReplyDAO;
import com.poly.dao.ShoppingCartDAO;
import com.poly.entity.DiscountProduct;
import com.poly.entity.Image;
import com.poly.entity.OrderDetail;
import com.poly.entity.Product;

import com.poly.service.SessionService;

@Controller
public class LoadPage {

	@Autowired
	HttpServletRequest request;
	@Autowired
	SessionService sessionService;
	@Autowired
	ProductDAO productDAO;
	@Autowired
	DiscountProductDAO dpDAO;

	@Autowired
	ImageDAO imageDAO;
	@Autowired
	OrderDetailDAO orderDetailDAO;
	

	@Autowired
	ReplyDAO replyDAO;

	@GetMapping({ "/contact.html", "/about.html", "/ChangeInfomation.html","/ChangeInfomation2.html" , "/TrangThai.html", "/ChangePassword.html"})
	public String loadPage(HttpServletRequest request) {
		String path = request.getServletPath();

		if ("/contact.html".equals(path)) {
			return "contact";

		} else if ("/about.html".equals(path)) {
			return "about";
		} else if ("/ChangeInfomation.html".equals(path)) {
			return "ChangeInfomation";
		} else if ("/ChangeInfomation2.html".equals(path)) {
			return "ChangeInfomation2";
		}else if ("/TrangThai.html".equals(path)) {
			return "TrangThai";
		} else if ("/ChangePassword.html".equals(path)) {
			return "ChangePassword";
		}
		 
		return "error";
	}

	@RequestMapping({ "/", "index.html" })
	public String index(Model model) {
		
		List<Image> images = imageDAO.findAll();
		List<Product> products = productDAO.findAll();
        List<List<Product>> pro = chunkList(products,4);
		List<DiscountProduct> discountProducts = dpDAO.findAll();
		List<Product> getNewProduct = productDAO.NewProduct();
		List<List<Product>> newProduct= chunkList(getNewProduct, 4); 
		List<Object[]> orderDetails = orderDetailDAO.findByAllTopProductOrderDetail();
        model.addAttribute("orderDetails", orderDetails);
		model.addAttribute("pro", pro);
		model.addAttribute("newProduct", newProduct);
		model.addAttribute("images", images);
		model.addAttribute("products", products);
		model.addAttribute("discountProducts", discountProducts);
		  // Truy vấn danh sách hãng và số lượng sản phẩm tương ứng
	    List<Object[]> results = productDAO.countProductsByCategory();
	    model.addAttribute("results", results);
	
		

		return "index";
	}
	private <T> List<List<T>> chunkList(List<T> list, int chunkSize) {
	    List<List<T>> chunks = new ArrayList<>();
	    for (int i = 0; i < list.size(); i += chunkSize) {
	        int end = Math.min(i + chunkSize, list.size());
	        chunks.add(new ArrayList<>(list.subList(i, end)));
	    }
	    return chunks;
	}
	

}

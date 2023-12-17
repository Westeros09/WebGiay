package com.poly.controller;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.poly.dao.AccountDAO;
import com.poly.dao.ImageDAO;
import com.poly.dao.OrderDAO;
import com.poly.dao.OrderDetailDAO;
import com.poly.dao.ProductDAO;
import com.poly.dao.ShoppingCartDAO;
import com.poly.dao.SizeDAO;
import com.poly.entity.Account;
import com.poly.entity.Image;
import com.poly.entity.Order;
import com.poly.entity.OrderDetail;
import com.poly.entity.Product;
import com.poly.service.AccountService;
import com.poly.service.OrderService;
import javax.servlet.http.HttpServletRequest;

@Controller
public class OrderStatusController {
	@Autowired
	AccountService accountService;
	@Autowired
	AccountDAO accdao;
	@Autowired
	OrderService orderService;
	@Autowired
	OrderDAO dao;
	@Autowired
	ShoppingCartDAO shoppingCartDAO;
	@Autowired
	ProductDAO productDAO;
	@Autowired
	OrderDAO orderDAO;
	@Autowired
	OrderDetailDAO orderDetailDAO;
	
	@Autowired
	SizeDAO sizeDAO;

	@Autowired
	ImageDAO imageDAO;

	@GetMapping("/TrangThai")
	public String viewOrderStatus(Model model, HttpServletRequest request) {
//		model.addAttribute("cartItems", shoppingCartDAO.getAll());
//		model.addAttribute("total", shoppingCartDAO.getAmount());
		return "TrangThai";
	}
	@GetMapping("/waitForConfimation" )
	public String handleOrderStatus(Model model, HttpServletRequest request) {
	    String remoteUser = request.getRemoteUser();
	    if (remoteUser != null) {
	        List<Product> products = productDAO.findAll();
	        List<Image> images = imageDAO.findAll();
	        model.addAttribute("products", products);
	        model.addAttribute("images", images);
	        List<Order> order = orderDAO.findByUsername(remoteUser);

	        Collections.sort(order, new Comparator<Order>() {
	            public int compare(Order o1, Order o2) {
	                return o2.getCreateDate().compareTo(o1.getCreateDate());
	            }
	        });

	        List<OrderDetail> orderDetail = orderDetailDAO.findAll();
	        model.addAttribute("order", order);
	        model.addAttribute("orderDetail", orderDetail);
	    }

	    String viewName = "orderstatus/" + request.getRequestURI().substring(1);
	    return viewName;
	}

	@PostMapping("/updateOrder")
	public String updateOrder(@RequestParam("orderId") String orderId) {
	    System.out.println(orderId);
	    try {
	        Long id = Long.parseLong(orderId);
	        Order order = orderDAO.findById(id).orElse(null);

	        if (order != null) {
	            System.out.println("ok");
	            order.setStatus("Đã Hủy");
	            orderDAO.save(order);

	            List<OrderDetail> orderDetails = order.getOrderDetails();
	            for (OrderDetail orderDetail : orderDetails) {
	                int productId = orderDetail.getProduct().getId();
	                int quantity = orderDetail.getQuantity();
	                Integer sizeId = orderDetail.getSize();

	                // Find the existing quantity in the Size entity
	                Integer quantitySize = sizeDAO.findQuantityByProductIdAndSize(productId, sizeId);

	                System.out.println("Original Quantity: " + quantitySize);
	                // Update the Size entity with the new quantity
	                sizeDAO.updateQuantityByProductIdAndSize(productId, sizeId, quantity + quantitySize);
	            }
	        } else {
	            // Handle case when order is not found
	        }
	    } catch (NumberFormatException e) {
	        // Handle the case when the orderId is not a valid Long
	        System.out.println("lỗi rồi bẹn ơi");
	    }
		return "redirect:/waitForConfimation";
	}

	
	/*
	 * @GetMapping("/repurchase/{orderId}") public String
	 * repurchase(@RequestParam("orderId") String orderId) { try { Long id =
	 * Long.parseLong(orderId); System.out.println("Order ID: " + id);
	 * List<OrderDetail> orderDetails = orderDetailDAO.findByOrderDetailId(id);
	 * 
	 * 
	 * if (!orderDetails.isEmpty()) {
	 * 
	 * 
	 * for (OrderDetail orderDetail : orderDetails) {
	 * System.out.println("Id product: "+orderDetail.getProduct().getId());
	 * 
	 * }
	 * 
	 * return "redirect:/cart.html"; } else {
	 * 
	 * System.out.println("Order details not found for ID: " + id); // Log the error
	 * } } catch (NumberFormatException e) {
	 * System.out.println("Error: Invalid orderId format"); } return
	 * "Error: Invalid orderId format"; }
	 */

}

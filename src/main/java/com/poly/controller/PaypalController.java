package com.poly.controller;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.poly.dao.AccountDAO;
import com.poly.dao.AddressDAO;
import com.poly.dao.OrderDAO;
import com.poly.dao.OrderDetailDAO;
import com.poly.dao.ProductDAO;
import com.poly.dao.SizeDAO;
import com.poly.entity.Account;
import com.poly.entity.Address;
import com.poly.entity.Order;
import com.poly.entity.OrderDetail;
import com.poly.entity.Product;
import com.poly.service.PaypalService;

@Controller
public class PaypalController {
	@Autowired
	PaypalService service;
	@Autowired
	OrderDAO orderDAO;
	@Autowired
	OrderDetailDAO orderDetailDAO;
	@Autowired
	ProductDAO productDAO;
	@Autowired
	AccountDAO accountDAO;
	@Autowired
	SizeDAO sizeDAO;
	@Autowired
	AddressDAO addressDAO;
	String city;

	public static final String SUCCESS_URL = "pay/success";
	public static final String CANCEL_URL = "pay/cancel";

	@PostMapping("/paypal")
	public String payment(Model model, @RequestParam double total, @RequestParam String address,
			@RequestParam (required = false) Integer address2, @RequestParam String fullname,
			@RequestParam(value = "productId", required = false) List<Integer> productID,
			@RequestParam(value = "sizeId", required = false) List<Integer> size,
			@RequestParam(value = "provinceLabel", required = false) String provinceLabel,
			@RequestParam(value = "districtLabel", required = false) String districtLabel,
			@RequestParam(value = "wardLabel", required = false) String wardLabel,
			@RequestParam String email,
			@RequestParam(value = "countProduct", required = false) List<Integer> count, HttpServletRequest request) {
		if (!email.matches("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$")) {
		    model.addAttribute("messages", "Vui lòng nhập địa chỉ email hợp lệ.");
		    return "forward:/check"; // Quay lại trang thanh toán với thông báo lỗi
		}

		boolean allProductsEnough = true; // Biến để theo dõi xem tất cả sản phẩm có đủ số lượng không
		// Tạo một danh sách để lưu trạng thái kiểm tra số lượng của từng sản phẩm
		List<Boolean> productStatus = new ArrayList<>();
		System.out.println(productID.size());
		for (int i = 0; i < productID.size(); i++) {
			Integer id = productID.get(i);
			Integer idSize = size.get(i);
			Integer countedQuantity = count.get(i);

			// Tìm số lượng (quantity) theo productId và sizeId
			Integer quantity = sizeDAO.findQuantityByProductIdAndSize(id, idSize);
			System.out.println(quantity);

			if (quantity != null) {
				// Kiểm tra xem số lượng có đủ để trừ không
				if (quantity >= countedQuantity) {
					// Sản phẩm này đủ số lượng
					productStatus.add(true);
				} else {
					// Sản phẩm này không đủ số lượng
					productStatus.add(false);
					allProductsEnough = false; // Đặt biến này thành false nếu ít nhất một sản phẩm không đủ
				}
			} else {
				// Xử lý nếu không tìm thấy thông tin sản phẩm (ví dụ: throw một Exception hoặc
				// xử lý lỗi khác)
				productStatus.add(false);
				allProductsEnough = false; // Đặt biến này thành false nếu có lỗi xảy ra
			}
		}

		if (allProductsEnough) {
			// Nếu tất cả sản phẩm có đủ số lượng, thực hiện cập nhật cho tất cả sản phẩm
			for (int i = 0; i < productID.size(); i++) {
				Integer id = productID.get(i);
				Integer idSize = size.get(i);
				Integer countedQuantity = count.get(i);

				// Trừ số lượng
				Integer quantity = sizeDAO.findQuantityByProductIdAndSize(id, idSize);
				Integer remainingQuantity = quantity - countedQuantity;

				// Cập nhật số lượng mới vào bảng Size
				sizeDAO.updateQuantityByProductIdAndSize(id, idSize, remainingQuantity);
			}
			/* return "thankyou"; */ // Chuyển hướng đến trang thành công hoặc trang bạn muốn
		} else {
			// Nếu ít nhất một sản phẩm không đủ số lượng, hiển thị thông báo hoặc xử lý lỗi
			model.addAttribute("messages",
					"Số lượng đơn giày của bạn muốn mua lớn hơn số lượng tồn kho cho ít nhất một sản phẩm!");
			return "cart.html";
		}
		if (address2 != null) {
			request.getSession().setAttribute("productID", productID);
			request.getSession().setAttribute("size", size);
			request.getSession().setAttribute("count", count);
			request.getSession().setAttribute("address2", address2);
			Optional<Address> a = addressDAO.findById(address2);
			String addressNoCity = a.get().getStreet() + ", " + a.get().getWard() + ", " + a.get().getDistrict();

			try {
				Payment payment = service.createPayment(total, "USD", "paypal", "sale", "test", fullname, addressNoCity,
						a.get().getCity(), "http://localhost:8080/" + CANCEL_URL, "http://localhost:8080/" + SUCCESS_URL);
				for (Links link : payment.getLinks()) {
					if (link.getRel().equals("approval_url")) {
						return "redirect:" + link.getHref();
					}
				}
			} catch (PayPalRESTException e) {
				e.printStackTrace();
			}

		} else {
			model.addAttribute("messages", "Vui lòng thêm địa chỉ");
			return "forward:/check";
		}
		

		return "redirect:/check";
	}

	// KHI THÀNH CÔNG
	@GetMapping(value = SUCCESS_URL)
	public String successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId,
			HttpServletRequest request) throws ParseException {
		List<Integer> productID = (List<Integer>) request.getSession().getAttribute("productID");
		List<Integer> size = (List<Integer>) request.getSession().getAttribute("size");
		List<Integer> count = (List<Integer>) request.getSession().getAttribute("count");
		Integer address2 = (Integer) request.getSession().getAttribute("address2");
		System.out.println(productID.size());
		for (int i = 0; i < productID.size(); i++) {
			Integer id = productID.get(i);
			System.out.println("Mã sp: " + id);
			System.out.println("*************************");
		}
		try {
			Payment payment = service.executePayment(paymentId, payerId);
			System.out.println(payment.toJSON());

			// Định dạng cho ngày tháng từ chuỗi của PayPal
			String paypalDateString = payment.getCreateTime();
			SimpleDateFormat paypalDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
			Date date = paypalDateFormat.parse(paypalDateString);
			Timestamp timestamp = new Timestamp(date.getTime());
			Optional<Address> a = addressDAO.findById(address2);
			String addressNoCity = a.get().getStreet() + ", " + a.get().getWard() + ", " + a.get().getDistrict();

			// LẤY THÔNG TIN
			String address = payment.getPayer().getPayerInfo().getShippingAddress().getLine1() + ", "
					+ a.get().getCity();
//			String city = payment.getPayer().getPayerInfo().getShippingAddress().getCity();
			String recipientName = payment.getPayer().getPayerInfo().getShippingAddress().getRecipientName();
			String totalAmountString = payment.getTransactions().get(0).getAmount().getTotal();

			if (payment.getState().equals("approved")) {
				//// ADD Order ////
				Order order = new Order();
				String username = request.getRemoteUser();
				Account user = accountDAO.findById(username).orElse(null);
				order.setCreateDate(timestamp);
				order.setAddress(address);
				order.setAccount(user);
				order.setNguoinhan(recipientName);
				order.setStatus("Đang Xác Nhận");
				order.setCity(a.get().getCity());
				order.setAvailable(true);
				System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
				try {
					double totalAmountDouble = Double.parseDouble(totalAmountString);
					order.setTongtien(totalAmountDouble);
				} catch (NumberFormatException e) {
					e.printStackTrace();
				}
				Order newOrder = orderDAO.saveAndFlush(order);
				//// ADD OrderDetail ////
				for (int i = 0; i < productID.size(); i++) {
					Product product = productDAO.findById(productID.get(i)).get();
					OrderDetail orderDetail = new OrderDetail();
					orderDetail.setOrder(newOrder);
					orderDetail.setProduct(product);
					orderDetail.setSize(size.get(i));
					orderDetail.setPrice(product.getPrice());
					orderDetail.setQuantity(count.get(i));
					orderDetailDAO.save(orderDetail);
				}
				return "redirect:/thankyou.html";
//				return "thankyou";
			}
		} catch (PayPalRESTException e) {
			System.out.println(e.getMessage());
		}
		return "redirect:/check";
	}

	@GetMapping(value = CANCEL_URL)
	public String cancelPay() {
		return "redirect:/check";
	}
}

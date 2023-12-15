package com.poly.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.config.VNPayConfig;
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

@Controller
public class VNPayController {
	@Autowired
	SizeDAO sizeDAO;
	@Autowired
	AccountDAO accountDAO;
	@Autowired
	AddressDAO addressDAO;
	@Autowired
	OrderDAO orderDAO;
	@Autowired
	ProductDAO productDAO;
	@Autowired
	OrderDetailDAO orderDetailDAO;
	String fulladdress;

	@GetMapping("/VnPay")
	public String getPay(Model model, HttpServletRequest request,
			@RequestParam(value = "productId", required = false) List<Integer> productID,
			@RequestParam(value = "sizeId", required = false) List<Integer> size,
			@RequestParam(value = "countProduct", required = false) List<Integer> count,
			@RequestParam (required = false) Integer address2,
			@RequestParam String fullname,
			@RequestParam double total

	) throws UnsupportedEncodingException {
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
			request.getSession().setAttribute("total", total);
			request.getSession().setAttribute("fullname", fullname);
		} else {
			model.addAttribute("messages", "Vui lòng thêm địa chỉ");
			return "forward:/check";
		}
		long convertedTotal = (long) total;
		String vnp_Version = "2.1.0";
		String vnp_Command = "pay";
		String orderType = "other";
		long amount = convertedTotal * 24000 * 100;
		String bankCode = "NCB";

		String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
		String vnp_IpAddr = VNPayConfig.getIpAddress(request);

		String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

		Map<String, String> vnp_Params = new HashMap<>();
		vnp_Params.put("vnp_Version", vnp_Version);
		vnp_Params.put("vnp_Command", vnp_Command);
		vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
		vnp_Params.put("vnp_Amount", String.valueOf(amount));
		vnp_Params.put("vnp_CurrCode", "VND");
		vnp_Params.put("vnp_BankCode", bankCode);

		vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
		vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
		vnp_Params.put("vnp_OrderType", orderType);
		vnp_Params.put("vnp_Locale", "vn");

		vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
		vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

		Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
		String vnp_CreateDate = formatter.format(cld.getTime());
		vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

		cld.add(Calendar.MINUTE, 15);
		String vnp_ExpireDate = formatter.format(cld.getTime());
		vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

		List fieldNames = new ArrayList(vnp_Params.keySet());
		Collections.sort(fieldNames);
		StringBuilder hashData = new StringBuilder();
		StringBuilder query = new StringBuilder();
		Iterator itr = fieldNames.iterator();
		while (itr.hasNext()) {
			String fieldName = (String) itr.next();
			String fieldValue = (String) vnp_Params.get(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				// Build hash data
				hashData.append(fieldName);
				hashData.append('=');
				hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
				// Build query
				query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
				query.append('=');
				query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
				if (itr.hasNext()) {
					query.append('&');
					hashData.append('&');
				}
			}
		}
		String queryUrl = query.toString();
		String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
		queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
		String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

		return "redirect:" + paymentUrl;

	}

	@GetMapping("/payment-confirm")
	public String handlePaymentResult(Model model, HttpServletRequest request, @RequestParam("vnp_ResponseCode") String responseCode) {
		if (responseCode.equals("00")) {
			List<Integer> productID = (List<Integer>) request.getSession().getAttribute("productID");
			List<Integer> size = (List<Integer>) request.getSession().getAttribute("size");
			List<Integer> count = (List<Integer>) request.getSession().getAttribute("count");
			Integer address2 = (Integer) request.getSession().getAttribute("address2");
			long total = (long) request.getSession().getAttribute("total");
			String fullname =  (String) request.getSession().getAttribute("fullname");
			//THÊM VÀO ORDER DB		
			Order order = new Order();
			Timestamp now = new Timestamp(new Date().getTime());
			String username = request.getRemoteUser();
			Account user = accountDAO.findById(username).orElse(null);
			order.setCreateDate(now);
			Optional<Address> a = addressDAO.findById(address2);
			fulladdress = a.get().getStreet() + ", " + a.get().getWard() + ", " + a.get().getDistrict() + ", "
					+ a.get().getCity();
			order.setAddress(fulladdress);
			System.out.println(order.getAddress());
			order.setDiscountCode(null); // May need a null check here for the discount object
			order.setAccount(user);
			order.setAvailable(false);
			order.setNguoinhan(fullname);
			order.setStatus("Đang Xác Nhận");
			order.setTongtien((double) total);
			order.setAvailable(true);
			order.setCity(a.get().getCity());
			Order newOrder = orderDAO.saveAndFlush(order);
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
		} else {
			model.addAttribute("messages", "Thanh toán không thành công. Vui lòng chọn thanh toán khác");
			return "forward:/check";
		}
	}
}

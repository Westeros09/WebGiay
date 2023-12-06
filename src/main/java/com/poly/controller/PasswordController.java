package com.poly.controller;
import java.io.File;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.poly.dao.AccountDAO;
import com.poly.dao.AddressDAO;
import com.poly.entity.Account;
import com.poly.entity.Address;
import com.poly.service.AccountService;
import com.poly.service.UploadService;
@Controller
public class PasswordController {
	@Autowired
	AccountDAO dao;
	@Autowired
	AccountService acdao;
	@Autowired
	UploadService uploadservice;
	@Autowired
	AddressDAO addressDAO;
	@GetMapping("/ChangePassword")
    public String showChangePasswordForm() {
        return "ChangePassword";
    }

	@PostMapping("/changepassword")
    public String changePassword(String oldPassword, String newPassword,String newPasswordAgain, RedirectAttributes redirectAttributes) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = dao.findById(username).orElse(null);
       
        if (account != null && acdao.changePassword(account, oldPassword, newPassword,newPasswordAgain)) {
            redirectAttributes.addFlashAttribute("success", "Thay đổi mật khẩu thành công.");
            return "redirect:/ChangePassword";
        } else {
           
        	redirectAttributes.addFlashAttribute("error", "Không thể thay đổi mật khẩu. Vui lòng kiểm tra lại.");
            return "redirect:/ChangePassword";
        }
    }
	
	 @GetMapping("/ChangeInfomation")
	 public String userProfileForm(Model model) {
	        String username = SecurityContextHolder.getContext().getAuthentication().getName();
	        Account account = dao.findById(username).orElse(null);
	        List<Address> userAddresses = addressDAO.getAddressesByUsername(username);
			model.addAttribute("userAddresses", userAddresses);
	        if (account != null) {
	            model.addAttribute("account", account);
	            return "ChangeInfomation";
	        } else {
	            return "redirect:/login";
	        }
	    }
	 /*
	 @PostMapping("/addAddressToProfile")
	 public String addAddressToProfile(Model model, @RequestParam String address,RedirectAttributes redirectAttributes,
	         @RequestParam(value = "provinceLabel", required = false) String provinceLabel,
	         @RequestParam(value = "districtLabel", required = false) String districtLabel,
	         @RequestParam(value = "wardLabel", required = false) String wardLabel, HttpServletRequest request) {
	     String username = SecurityContextHolder.getContext().getAuthentication().getName();
	     Account user = dao.findById(username).orElse(null);

	     if (user == null) {
	         // Xử lý khi không tìm thấy người dùng
	         return "redirect:/login";
	     }

	     if (provinceLabel == null || provinceLabel.isEmpty() 
	             || districtLabel == null || districtLabel.isEmpty()
	             || wardLabel == null || wardLabel.isEmpty() 
	             || address == null || address.isEmpty()) {
	    	 redirectAttributes.addFlashAttribute("error", "Không thể thêm địa chỉ. Vui lòng kiểm tra lại.");
	         return "redirect:/ChangeInfomation";
	     } else {
	         Address ad = new Address();
	         ad.setAccount(user);
	         ad.setAddressDetail(address + ", " + wardLabel + ", " + districtLabel + ", " + provinceLabel);
	         ad.setCity(provinceLabel);
	         ad.setDistrict(districtLabel);
	         ad.setWard(wardLabel);
	         ad.setStreet(address);
	         addressDAO.save(ad);
	         redirectAttributes.addFlashAttribute("success", "Thêm địa chỉ thành công.");
	         return "redirect:/ChangeInfomation";
	     }
	 }*/
	 @PostMapping("/profile")
	 public String updateUserProfile(
	         @ModelAttribute Account updatedAccount,
	         @RequestParam("image") MultipartFile imageFile,
	         @RequestParam(value = "address", required = false) String address,
	         @RequestParam(value = "provinceLabel", required = false) String provinceLabel,
	         @RequestParam(value = "districtLabel", required = false) String districtLabel,
	         @RequestParam(value = "wardLabel", required = false) String wardLabel,
	         RedirectAttributes redirectAttributes) {

	     String username = SecurityContextHolder.getContext().getAuthentication().getName();
	     try {
	         if (!imageFile.isEmpty()) {
	             String originalFilename = imageFile.getOriginalFilename();
	             String fileName = uploadservice.save(imageFile, "images").getPath();
	             File savedFile = new File(fileName);
	             String imagePath = savedFile.getName();
	             updatedAccount.setPhoto(imagePath);
	             boolean success = acdao.updateProfile(username, updatedAccount.getFullname(), updatedAccount.getEmail(), updatedAccount.getPhoto());
	             if (success) {
	                 redirectAttributes.addFlashAttribute("success", "Thông tin cá nhân đã được cập nhật thành công.");
	             } else {
	                 redirectAttributes.addFlashAttribute("error", "Không thể cập nhật thông tin cá nhân. Vui lòng kiểm tra lại.");
	             }
	         }

	         if (address != null && !address.isEmpty()
	                 && provinceLabel != null && !provinceLabel.isEmpty()
	                 && districtLabel != null && !districtLabel.isEmpty()
	                 && wardLabel != null && !wardLabel.isEmpty()) {

	             Account user = dao.findById(username).orElse(null);

	             if (user != null) {
	                 Address ad = new Address();
	                 ad.setAccount(user);
	                 ad.setAddressDetail(address + ", " + wardLabel + ", " + districtLabel + ", " + provinceLabel);
	                 ad.setCity(provinceLabel);
	                 ad.setDistrict(districtLabel);
	                 ad.setWard(wardLabel);
	                 ad.setStreet(address);
	                 addressDAO.save(ad);
	                 redirectAttributes.addFlashAttribute("success", "Địa chỉ đã được cập nhật thành công");
	             } else {
	                 redirectAttributes.addFlashAttribute("error", "Cập nhật không thành công. Vui lòng kiểm tra lại.");
	             }
	         }

	         boolean successWithoutPhoto = acdao.updateProfileWithoutPhoto(username, updatedAccount.getFullname(), updatedAccount.getEmail());

	         if (successWithoutPhoto) {
	             redirectAttributes.addFlashAttribute("success", "Thông tin cá nhân đã được cập nhật thành công.");
	         } else {
	             redirectAttributes.addFlashAttribute("error", "Không thể cập nhật thông tin cá nhân. Vui lòng kiểm tra lại.");
	         }

	     } catch (Exception e) {
	         redirectAttributes.addFlashAttribute("error", "Không thể cập nhật thông tin cá nhân. Vui lòng kiểm tra lại.");
	     }

	     return "redirect:/ChangeInfomation";
	 }

	 /*

đây là postmapping của thêm địa chỉ
 @PostMapping("/profile")
	 public String updateUserProfile(@ModelAttribute Account updatedAccount, @RequestParam("image") MultipartFile imageFile, RedirectAttributes redirectAttributes) {
	     String username = SecurityContextHolder.getContext().getAuthentication().getName();
	     if (!imageFile.isEmpty()) {
	         try {
	             String originalFilename = imageFile.getOriginalFilename();
	             String fileName = uploadservice.save(imageFile, "images").getPath();
	             File savedFile = new File(fileName);
	             String imagePath = savedFile.getName();
	             updatedAccount.setPhoto(imagePath);
	             boolean success = acdao.updateProfile(username, updatedAccount.getFullname(), updatedAccount.getEmail(), updatedAccount.getPhoto());

	             if (success) {
	                 redirectAttributes.addFlashAttribute("success", "Thông tin cá nhân đã được cập nhật thành công.");
	             } else {
	                 redirectAttributes.addFlashAttribute("error", "Không thể cập nhật thông tin cá nhân. Vui lòng kiểm tra lại.");
	             }
	         } catch (Exception e) {
	             redirectAttributes.addFlashAttribute("error", "Không thể tải lên hình ảnh. Vui lòng kiểm tra lại.");
	         }
	     } else {
	         boolean success = acdao.updateProfileWithoutPhoto(username, updatedAccount.getFullname(), updatedAccount.getEmail());

	         if (success) {
	             redirectAttributes.addFlashAttribute("success", "Thông tin cá nhân đã được cập nhật thành công.");
	         } else {
	             redirectAttributes.addFlashAttribute("error", "Không thể cập nhật thông tin cá nhân. Vui lòng kiểm tra lại.");
	         }
	     }

	     return "redirect:/ChangeInfomation";
	 }
	 */



	 @PostMapping("/updateAddressToProfile")
	 public String updateAddressToProfile(Model model,RedirectAttributes redirectAttributes, @RequestParam(value = "address2", required = false) Integer address2,
	         @RequestParam String address, @RequestParam(value = "provinceLabel", required = false) String provinceLabel,
	         @RequestParam(value = "districtLabel", required = false) String districtLabel,
	         @RequestParam(value = "wardLabel", required = false) String wardLabel, HttpServletRequest request) {
	     if (address2 == null) {
	    	
	         return "redirect:/ChangeInfomation";
	     }

	     Optional<Address> optionalAddress = addressDAO.findById(address2);
	     if (optionalAddress.isPresent()) {
	         Address existingAddress = optionalAddress.get();
	         existingAddress.setCity(provinceLabel);
	         existingAddress.setDistrict(districtLabel);
	         existingAddress.setWard(wardLabel);
	         existingAddress.setStreet(address);
	         existingAddress.setAddressDetail(address + ", " + wardLabel + ", " + districtLabel + ", " + provinceLabel);
	         addressDAO.save(existingAddress);
	         redirectAttributes.addFlashAttribute("success", "Địa chỉ đã được sửa thành công");
	         return "redirect:/ChangeInfomation";
	     } else {
	    	 redirectAttributes.addFlashAttribute("error", "Không tìm thấy địa chỉ cần sửa");
	         return "redirect:/ChangeInfomation";
	     }
	 }
	 @PostMapping("/deleteAddressFromProfile")
	 public String deleteAddressFromProfile(@RequestParam(value = "address2", required = false) Integer address2, RedirectAttributes redirectAttributes) {
	     if (address2 == null) {
	         redirectAttributes.addFlashAttribute("error", "Vui lòng chọn địa chỉ để xóa");
	     } else {
	         addressDAO.deleteById(address2);
	         redirectAttributes.addFlashAttribute("success", "Địa chỉ đã được xóa thành công");
	     }
	     return "redirect:/ChangeInfomation";
	 }



	 
	

	


	
	 
	    }

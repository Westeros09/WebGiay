package com.poly.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.poly.dao.AccountDAO;

import lombok.Data;

@SuppressWarnings("serial")
@Data
@Entity
@Table(name = "Accounts")
public class Account implements Serializable {

	@Id
	@NotBlank(message = "Tên đăng nhập không được để trống")
	@Column(unique = true)
	String username;
	@NotBlank(message = "Mật khẩu không được để trống")
	String password;
	@NotBlank(message = "Họ và tên không được để trống")
	String fullname;
	@NotBlank(message = "Email không được để trống")
	@Email(message = "Email không hợp lệ")
	String email;
	String photo;

	@JsonIgnore
	@OneToMany(mappedBy = "account")
	List<Order> orders;

	@JsonIgnore
	@OneToMany(mappedBy = "account")
	List<Address> addresses;

	@JsonIgnore
	@OneToMany(mappedBy = "account", fetch = FetchType.EAGER)
	List<Authority> authorities;

	@JsonIgnore
	@OneToMany(mappedBy = "account")
	List<ShoppingCart> shoppingCarts;

	@JsonIgnore
	@OneToMany(mappedBy = "account")
	private List<Comment> comments;

	@JsonIgnore
	@OneToMany(mappedBy = "account")
	private List<Reply> reply;

	public Account(String username, String password, String fullname, String email) {
		super();
		this.username = username;
		this.password = password;
		this.fullname = fullname;
		this.email = email;
	}

	public Account() {
		super();
	}

}

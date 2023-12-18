package com.poly.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.filter.CharacterEncodingFilter;

import com.poly.service.UserService;

@Configuration
@EnableWebSecurity
public class AuthConfig extends WebSecurityConfigurerAdapter {


	@Bean
	public BCryptPasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}



	@Autowired
	UserService userService;

	// quản lý người dữ liệu người sử dụng
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userService);
	}

	// phân quyền sử dụng và hình thức đăng nhập
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// CSRF, CORS
		http.csrf().disable();

		// phân quyền sử dụng
		// demo 1
		http.authorizeRequests()

		.antMatchers("/assets/**").hasAnyRole("ADMI")
		.antMatchers("/check/**").authenticated()
		.antMatchers("/shop.html/addComments/**").authenticated()
		.antMatchers("/shop.html/replyComments**").authenticated()

		
		.antMatchers("/rest/authorities","/rest/revenue").hasRole("ADMI")

		.anyRequest().permitAll(); // anonymous

		// giao diện đăng nhập
		http.formLogin().loginPage("/login")
				.loginProcessingUrl("/login/success") // login
				.defaultSuccessUrl("/index.html", false) // sau khi đăng nhập quay lại trang trước
				.failureUrl("/login/error") // sai username password
				.usernameParameter("username").passwordParameter("password");

		http.rememberMe().rememberMeParameter("remember");

		// đăng xuất
		http.logout().logoutUrl("/logout").logoutSuccessUrl("/logout/success");

		// oauth2 - đăng nhập từ mạng xh
		http.oauth2Login()
		.loginPage("/login.html")
		.defaultSuccessUrl("/oauth2/login/success", true)
		.failureUrl("/login.html/error")
		.authorizationEndpoint()
		.baseUri("/oauth2/authorization");

	}

	// Cho phép truy xuất REST API từ domain khác
	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
	}

}

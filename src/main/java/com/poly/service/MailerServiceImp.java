package com.poly.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.poly.entity.MailInfo;


@Service
public class MailerServiceImp  implements MailerService{

	  
	@Autowired
	JavaMailSender sender;
	@Autowired
	MailerService mailerService;
   
	@Override
	public void send(MailInfo mail) throws MessagingException {
		// TODO Auto-generated method stub
		MimeMessage message = sender.createMimeMessage();

		// Sử dụng Helper để thiết lập các thông tin cần thiết cho message

		MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
		helper.setTo(mail.getTo());
		helper.setSubject(mail.getSubject());
		helper.setText(mail.getBody(), true);

		String[] cc = mail.getCc();
		if (cc != null && cc.length > 0) {
			helper.setCc(cc);
		}

		String[] bcc = mail.getBcc();
		if (bcc != null && bcc.length > 0) {
			helper.setBcc(bcc);
		}

		List<File> files = mail.getFiles();
		if (files.size() > 0) {
			for (File file : files) {
				helper.addAttachment(file.getName(), file);
			}
		}
		// Gửi message đến SMTP server
		sender.send(message);
	}

	@Override
	public void send(String to, String subject, String body) throws MessagingException {
		// TODO Auto-generated method stub
		this.send(new MailInfo(to, subject, body));
	}

	List<MailInfo> list = new ArrayList<>();
	@Override
	public void queue(MailInfo mail) {
		// TODO Auto-generated method stub
		list.add(mail);
	}

	@Override
	public void queue(String to, String subject, String body) {
		// TODO Auto-generated method stub
		queue(new MailInfo(to, subject, body));
	}
	
	@Scheduled(fixedDelay = 5000)
	public void run() {
		while (!list.isEmpty()) {
			MailInfo mail = list.remove(0);
			try {
				this.send(mail);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	@Override
	public void setMailBody(MailInfo mail, String body) {
	    mail.setBody(body);
	}
	public void sendOtp(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your_email@gmail.com");
        message.setTo(to);
        message.setSubject("OTP Verification");
        message.setText("Your OTP is: " + otp);

        sender.send(message);
    }

	@Override
	public void sendOtpEmail(String to, String subject, String body) {
		 SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo(to);
	        message.setSubject(subject);
	        message.setText(body);
	        sender.send(message);
	    }
		
	

	 
}

package com.poly.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;

@Service
public class FileManagerService {
	@Autowired
	ServletContext app = null;

	// đưa thư mục, đưa file => đường dẫn đầy đủ
	private Path getPath(String folder, String filename) {
		File dir = Paths.get(app.getRealPath("/files/"), folder).toFile();
		if (!dir.exists()) {
			dir.mkdirs();
		}
		return Paths.get(dir.getAbsolutePath(), filename);
	}

	public byte[] read(String folder, String filename) {
		Path path = this.getPath(folder, filename);
		try {
			return Files.readAllBytes(path);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public List<String> save(String folder, MultipartFile[] files) {
		List<String> filenames = new ArrayList<String>();
		for (MultipartFile file : files) {
			// file + thời gian ra tên duy nhất
			String name = System.currentTimeMillis() + file.getOriginalFilename();
			String filename = Integer.toHexString(name.hashCode()) + name.substring(name.lastIndexOf("."));
			Path rootPath = this.getPath(folder, filename); // Đường dẫn đầy đủ của thư mục
			Path additionalPath = Paths.get(app.getRealPath("/images/"), filename); // Đường dẫn đầy đủ của thư mục
																					// /webapp/images

			try {
				// Lưu ảnh vào thư mục gốc
				file.transferTo(rootPath);
				// Lưu ảnh vào thư mục /webapp/images
				Files.copy(rootPath, additionalPath);

				filenames.add(filename);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return filenames;
	}

	public void delete(String folder, String filename) {
		Path path = this.getPath(folder, filename);
		path.toFile().delete();
	}

	public List<String> list(String folder) {
		List<String> filenames = new ArrayList<String>();
		File dir = Paths.get(app.getRealPath("/files/"), folder).toFile();
		if (dir.exists()) {
			File[] files = dir.listFiles();
			for (File file : files) {
				filenames.add(file.getName());
			}
		}
		return filenames;
	}

	public void deleteAll(String folder) {
		File dir = Paths.get(app.getRealPath("/files/"), folder).toFile();
		if (dir.exists() && dir.isDirectory()) {
			File[] files = dir.listFiles();
			for (File file : files) {
				try {
					Files.delete(file.toPath());
				} catch (IOException e) {
					e.printStackTrace();
					// Xử lý lỗi nếu cần
				}
			}
		}
	}
}

package com.poly.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.poly.service.FileManagerService;

import java.io.File;
import java.util.List;

@CrossOrigin("*")
@RestController
public class FileManagerRestController {

    @Autowired
    FileManagerService fileService;

    @GetMapping("/rest/files/{folder}")
    public List<String> list(@PathVariable String folder) {
        return fileService.list(folder);
    }

    @GetMapping("/rest/files/{folder}/{file}")
    public byte[] download(@PathVariable String folder, @PathVariable String file) {
        return fileService.read(folder, file);
    }

    @PostMapping("/rest/files/{folder}")
    public List<String> upload(@PathVariable String folder, @RequestParam("files") MultipartFile[] files) {
        return fileService.save(folder, files);
    }

    @DeleteMapping("/rest/files/{folder}/{file}")
    public void delete(@PathVariable String folder, @PathVariable String file) {
        fileService.delete(folder, file);
    }


   
}

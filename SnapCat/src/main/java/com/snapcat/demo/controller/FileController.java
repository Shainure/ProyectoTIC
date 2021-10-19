package com.snapcat.demo.controller;

import com.snapcat.demo.payload.UploadFileResponse;
import com.snapcat.demo.repository.readRepository;
import com.snapcat.demo.service.DBFileStorageService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


import com.snapcat.demo.model.DBFile;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
public class FileController {

    // private static final Logger logger =
    // LoggerFactory.getLogger(FileController.class);

    @Autowired
    private DBFileStorageService dbFileStorageService;
    @Autowired
    private readRepository repo;

    @PostMapping("/uploadFile")
    public UploadFileResponse uploadFile(String descripcion, String name, String genero, String nacimiento,
            @RequestParam("file") MultipartFile file) {

        DBFile dbFile = dbFileStorageService.storeFile(descripcion, name, genero, nacimiento, file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/downloadFile/")
                .path(dbFile.getId()).toUriString();

        return new UploadFileResponse(descripcion, genero, name, nacimiento, dbFile.getFileName(), fileDownloadUri,
                file.getContentType(), file.getSize());
    }

    @GetMapping("/downloadFile/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
        // Load file from database
        DBFile dbFile = dbFileStorageService.getFile(fileId);

        
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(dbFile.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dbFile.getFileName() + "\"")
                .body(new ByteArrayResource(dbFile.getData()));
    }

    @GetMapping("/cargarForm/{fileId}")
    public DBFile cargarView(@PathVariable String fileId) {
        
        DBFile dbFile = dbFileStorageService.getFile(fileId);
        return dbFile;
    }

    
    @GetMapping(path = { "/get" })
    public List<DBFile> getImage() throws IOException {
        List<DBFile> listaPics = new ArrayList<DBFile>();
        final List<DBFile> pic = repo.findAll();
        for (DBFile currentPic : pic) {
            DBFile img = new DBFile(currentPic.getId(), currentPic.getDescripcion(), currentPic.getName(), 
            currentPic.getGenero(), currentPic.getNacimiento(), currentPic.getFileName(), currentPic.getFileType(),
                currentPic.getData(), currentPic.getDate_entry());
            listaPics.add(img);
        }
        
        return listaPics;
    }

}
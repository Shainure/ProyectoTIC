package com.snapcat.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Date;

import com.snapcat.demo.model.DBFile;
import com.snapcat.demo.repository.DBFileRepository;
import com.snapcat.demo.exception.*;

@Service
public class DBFileStorageService {

    @Autowired
    private DBFileRepository dbFileRepository;

    public DBFile storeFile(String descripcion, String name, String genero, String nacimiento, MultipartFile file) {
        // Normalize file name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the file's name contains invalid characters
            if(fileName.contains("..")) {
                throw new FileStorageException("El nombre del archivo contiene una secuencia inválida: " + fileName);
            }

            DBFile dbFile = new DBFile(null, descripcion, name, genero, 
                nacimiento, fileName, file.getContentType(), file.getBytes(), new Date());

            return dbFileRepository.save(dbFile);
        } catch (IOException ex) {
            throw new FileStorageException("No se pudo almacenar el archivo " + fileName + ". Intenta de nuevo.", ex);
        }
    }

    public DBFile getFile(String fileId) {
        return dbFileRepository.findById(fileId)
                .orElseThrow(() -> new MyFileNotFoundException("Archivo no encontrado, id " + fileId));
    }
}
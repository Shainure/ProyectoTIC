package com.snapcat.demo.model;

import org.hibernate.annotations.GenericGenerator;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.*;

@Entity
@Table(name = "fotos")
public class DBFile {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(length = 80)
    private String id;

    @Column(length = 30)
    private Date date_entry;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(nullable = false, length = 30) 
    private String name;

    @Column(length = 15)
    private String genero;

    @Column(length = 15)
    private String nacimiento;

    // datos archivo

    @Column(length = 50)
    private String fileName;

    @Column(length = 20)
    private String fileType;

    @Lob
    private byte[] data;

    public DBFile() {

    }

    public DBFile(String id, String descripcion, String name, String genero, String nacimiento, String fileName, String fileType,
            byte[] data, Date date_entry) {
        this.id = id;
        this.descripcion = descripcion;
        this.name = name;
        this.genero = genero;
        this.nacimiento = nacimiento;
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");  
        this.date_entry =  date_entry;
    }



    public Date getDate_entry() {
        return date_entry;
    }

    public void setDate_entry(Date date_entry) {
        this.date_entry = date_entry;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getNacimiento() {
        return nacimiento;
    }

    public void setNacimiento(String nacimiento) {
        this.nacimiento = nacimiento;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

}
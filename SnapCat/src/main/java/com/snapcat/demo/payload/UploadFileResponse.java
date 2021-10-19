package com.snapcat.demo.payload;

public class UploadFileResponse {
    private String descripcion;
    private String genero;
    private String name;
    private String nacimiento;

    private String fileName;
    private String fileDownloadUri;
    private String fileType;
    private long size;


    //Clase para la subida dle archivo   

    public UploadFileResponse(String descripcion, String genero, String name, String nacimiento, String fileName,
            String fileDownloadUri, String fileType, long size) {
        this.descripcion = descripcion;
        this.genero = genero;
        this.name = name;
        this.nacimiento = nacimiento;
        this.fileName = fileName;
        this.fileDownloadUri = fileDownloadUri;
        this.fileType = fileType;
        this.size = size;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileDownloadUri() {
        return fileDownloadUri;
    }

    public void setFileDownloadUri(String fileDownloadUri) {
        this.fileDownloadUri = fileDownloadUri;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

}
package com.snapcat.demo.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.snapcat.demo.model.DBFile;

@Repository //Indico que es un repositorio
public interface readRepository extends CrudRepository<DBFile, Long>{   
    List <DBFile> findAll();
    
}
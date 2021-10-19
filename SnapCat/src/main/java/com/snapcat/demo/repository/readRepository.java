package com.snapcat.demo.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
//import antlr.collections.List;

import com.snapcat.demo.model.DBFile;

@Repository //Indico que es un repositorio
public interface readRepository extends CrudRepository<DBFile, Long>{   //Objeto que recibe y tipo de dato
    //incluye crud básico por defecto al extender de crud repository, no es *necesario* hacer más
    List <DBFile> findAll();
    
}
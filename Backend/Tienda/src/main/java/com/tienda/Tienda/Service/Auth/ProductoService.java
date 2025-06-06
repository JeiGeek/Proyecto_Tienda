package com.tienda.Tienda.Service.Auth;

import com.tienda.Tienda.Modelos.Producto;
import com.tienda.Tienda.Repo.ProductoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepo productoRepo;


    public List<Producto> obtenerTodos(){
        return productoRepo.findAll();
    }


    public Optional<Producto> obtenerPorId(Long id){
        return productoRepo.findById(id);
    }


    public Producto guardarProducto(Producto producto){
        return productoRepo.save(producto);
    }


    public void eliminarProducto(Long id){
        productoRepo.deleteById(id);
    }

}

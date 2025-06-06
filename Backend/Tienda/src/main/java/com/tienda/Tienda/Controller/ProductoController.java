package com.tienda.Tienda.Controller;


import com.tienda.Tienda.Modelos.Producto;
import com.tienda.Tienda.Repo.ProductoRepo;
import com.tienda.Tienda.Service.Auth.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ProductoRepo productoRepo;


    @GetMapping
    public List<Producto> obtenerTodos(){
        return productoService.obtenerTodos();
    }


    @GetMapping("/{id}")
    public Optional<Producto> obtenerPorId(@PathVariable Long id){
        return productoService.obtenerPorId(id);
    }


    @PostMapping("/crear")
    public ResponseEntity<Producto> crearProducto(@RequestParam("nombre") String nombre, @RequestParam("descripcion") String descripcion,
                                                  @RequestParam("precio") BigDecimal precio, @RequestParam("stock") Integer stock,
                                                  @RequestParam("imagen") MultipartFile imagen)
    {

        try{

            String imagenUrl = uploadImagen(imagen);

            Producto producto = new Producto();
            producto.setNombre(nombre);
            producto.setDescripcion(descripcion);
            producto.setPrecio(precio);
            producto.setStock(stock);
            producto.setImagenUrl(imagenUrl);

            return ResponseEntity.ok(productoRepo.save(producto));

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }


    private String uploadImagen(MultipartFile file) throws IOException{

        Path uploadPath = Paths.get("uploads/");

        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString();

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');

        if (dotIndex > 0){
            extension = originalFilename.substring(dotIndex);
        }else{
            extension = ".jpg";
        }

        fileName += extension;

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/api/uploads/" + fileName;
    }


    @PutMapping("/actualizar/{id}")
    public ResponseEntity <Producto> actualizarProducto(@PathVariable Long id,
                                                        @RequestParam("nombre") String nombre, @RequestParam("descripcion") String descripcion,
                                                        @RequestParam("precio") BigDecimal precio, @RequestParam("stock") Integer stock,
                                                        @RequestParam(value = "imagen", required = false) MultipartFile imagen)
    {
        Optional<Producto> productoExistente = productoService.obtenerPorId(id);

        if(productoExistente.isPresent()){

            Producto producto = productoExistente.get();
            producto.setNombre(nombre);
            producto.setDescripcion(descripcion);
            producto.setPrecio(precio);
            producto.setStock(stock);

            if (imagen != null && !imagen.isEmpty()){

                try {
                    String imagenUrl = uploadImagen(imagen);
                    producto.setImagenUrl(imagenUrl);
                }catch (IOException e){
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }

            }

            Producto productoActualizado = productoService.guardarProducto(producto);
            return ResponseEntity.ok(productoActualizado);
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id){
        productoService.eliminarProducto(id);
    }

}

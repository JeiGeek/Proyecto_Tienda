package com.tienda.Tienda.Controller;

import com.tienda.Tienda.Modelos.Usuario;
import com.tienda.Tienda.Service.Auth.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

    @GetMapping("/perfil")
    public ResponseEntity<Usuario> getPerfilUsuario(@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();

        Usuario usuario = usuarioService.obtenerUsuariopPorUsername(username);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/perfil/actualizar")
    public ResponseEntity <?> actualizarPerfilUsuario(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Usuario usuarioActualizado){
        try{
            String username = userDetails.getUsername();
            Usuario usuario= usuarioService.obtenerUsuariopPorUsername(username);

            if(usuario==null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            }
            if(usuarioActualizado.getNombre() == null || usuarioActualizado.getNombre().isEmpty()){
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }
            if(usuarioActualizado.getEmail() == null || usuarioActualizado.getEmail().isEmpty()){
                return ResponseEntity.badRequest().body("El Email es obligatorio");
            }

            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setEmail(usuarioActualizado.getEmail());
            usuario.setTelefono(usuarioActualizado.getTelefono());
            usuario.setPais(usuarioActualizado.getPais());

            Usuario usuarioActualizadoDB = usuarioService.actualizarUsuario(usuario);
            return ResponseEntity.ok(usuarioActualizadoDB);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el perfil" + e.getMessage());

        }
    }

    @PutMapping("/actualizar_user/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        Usuario usuario = usuarioService.actualizarUsuarioPorId(id, usuarioActualizado);

        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario con id " + id + " no encontrado");
        }
    }


    @PutMapping("/perfil/actualizar/imagen")
    public ResponseEntity<Usuario> actualizarImagenPerfil(@AuthenticationPrincipal UserDetails userDetails,
                                                          @RequestParam("imagen")MultipartFile imagen){
        String username = userDetails.getUsername();

        Usuario usuario = usuarioService.obtenerUsuariopPorUsername(username);

        try{
            String imageUrl = uploadImagen(imagen);

            usuario.setImagenUrl(imageUrl);
            Usuario usuarioActualizadoDB = usuarioService.actualizarUsuario(usuario);

            return ResponseEntity.ok(usuarioActualizadoDB);
        }catch(IOException e){
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

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuarioPorId(id);
            return ResponseEntity.ok("Usuario eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el usuario: " + e.getMessage());
        }
    }

    @GetMapping("/admin/status")
    public ResponseEntity<Boolean> esAdmin(Authentication authentication) {
        String username = authentication.getName(); // obtiene el username del usuario autenticado
        boolean esAdmin = usuarioService.esUsuarioAdmin(username);
        return ResponseEntity.ok(esAdmin);
    }

}




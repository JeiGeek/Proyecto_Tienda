package com.tienda.Tienda.Service.userdetails;

import com.tienda.Tienda.Modelos.Usuario;
import com.tienda.Tienda.Repo.UserRepo;
import com.tienda.Tienda.Service.Auth.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public List<Usuario> obtenerTodos() {
        return userRepo.findAll();
    }


    @Override
    public Usuario obtenerUsuariopPorUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario No Encontrado"));
    }

    @Override
    public Usuario actualizarUsuario(Usuario usuario) {
        return userRepo.save(usuario);
    }

    @Override
    public Usuario actualizarUsuarioPorId(Long id, Usuario usuarioActualizado) {
        Optional<Usuario> optionalUsuario = userRepo.findById(id);

        if (optionalUsuario.isPresent()) {
            Usuario usuarioExistente = optionalUsuario.get();

            // Actualizamos solo los campos permitidos
            usuarioExistente.setUsername(usuarioActualizado.getUsername());
            usuarioExistente.setEmail(usuarioActualizado.getEmail());
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
            usuarioExistente.setPais(usuarioActualizado.getPais());
            usuarioExistente.setTelefono(usuarioActualizado.getTelefono());
            usuarioExistente.setAdmin(usuarioActualizado.isAdmin());

            // Guardamos el usuario actualizado
            return userRepo.save(usuarioExistente);
        } else {
            // Si no existe, puedes devolver null o lanzar excepción
            return null;
        }
    }

    @Override
    public void eliminarUsuarioPorId(Long id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
        } else {
            throw new RuntimeException("Usuario con id " + id + " no existe");
        }
    }

    @Override
    public boolean esUsuarioAdmin(String username) {
        Usuario usuario = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.isAdmin();

    }

}



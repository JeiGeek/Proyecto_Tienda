package com.tienda.Tienda.Service.Auth;

import com.tienda.Tienda.Modelos.Usuario;

import java.util.List;


public interface UsuarioService {

    List<Usuario> obtenerTodos();

    Usuario obtenerUsuariopPorUsername(String username);

    Usuario actualizarUsuario(Usuario usuario);

    Usuario actualizarUsuarioPorId(Long id, Usuario usuarioActualizado);

    void eliminarUsuarioPorId(Long id);

    boolean esUsuarioAdmin(String username);
}



package com.tienda.Tienda.Service.Auth;

import com.tienda.Tienda.Modelos.Usuario;

import java.util.Optional;

public interface AuthService {

    String login(String username, String password);

    String singnUp(String nombre, String username, String password, String email);

    String verifyToken(String token);

    Optional<Usuario> findByEmail(String email);

    void saveUserVerficationToken(Usuario theUser, String verificationToken);

    String validateToken(String theToken);
}

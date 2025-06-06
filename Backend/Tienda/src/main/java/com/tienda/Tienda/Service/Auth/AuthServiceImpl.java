package com.tienda.Tienda.Service.Auth;

import com.tienda.Tienda.Listener.RegistrationCompleteEvent;
import com.tienda.Tienda.Modelos.Usuario;
import com.tienda.Tienda.Repo.UserRepo;
import com.tienda.Tienda.Token.VerificationToken;
import com.tienda.Tienda.Token.VerificationTokenRepository;
import com.tienda.Tienda.Util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;


    @Override
    public String login(String username, String password) {

        Optional <Usuario> optionalUser = userRepo.findByUsername(username);
        if(optionalUser.isEmpty()){
            throw new RuntimeException("Usuario no encontrado");
        }

        Usuario user = optionalUser.get();
        if (!user.isEnabled()){
            throw new RuntimeException("La cuenta no ha sido verificada");
        }

        var authToken = new UsernamePasswordAuthenticationToken(username,password);
        var authenticate = authenticationManager.authenticate(authToken);

        return JwtUtils.generateToken(((UserDetails) (authenticate.getPrincipal())).getUsername());
    }


    @Override
    public String singnUp(String nombre, String username, String password, String email) {

        if (userRepo.existsByUsername(username)){
            throw new RuntimeException("El username ya existe");
        }

        if (userRepo.existsByEmail(email)){
            throw new RuntimeException("El corrreo electronico ya existe");
        }

        Usuario user = new Usuario();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setNombre(nombre);
        user.setEmail(email);

        user.setFechaRegistro(LocalDateTime.now());
        user.setEnabled(false);


        userRepo.save(user);
        eventPublisher.publishEvent(new RegistrationCompleteEvent(user, "..."));


        return "verifica tu email";
    }


    @Override
    public String verifyToken(String token) {
        var usernameOptional = JwtUtils.getUsernameFromToken(token);

        if (usernameOptional.isPresent()){
            return usernameOptional.get();
        }
        throw new RuntimeException("Token invalido");
    }


    @Override
    public Optional<Usuario> findByEmail(String email){
        return userRepo.findByEmail(email);
    }


    @Override
    public void saveUserVerficationToken(Usuario theUser, String token) {

        var verficationToken = new VerificationToken(token, theUser);

        tokenRepository.save(verficationToken);

    }


    @Override
    public String validateToken(String theToken) {

        VerificationToken token = tokenRepository.findByToken(theToken);

        if (token == null){
            System.out.println("Token no encontrado en la base de datos");
            return "Token de verificación no valido";
        }

        Usuario user = token.getUser();
        System.out.println("Estado actual del usuario" + user.isEnabled());

        Calendar calendar = Calendar.getInstance();
        if ((token.getExpirationTme().getTime() - calendar.getTime().getTime()) <= 0 ){
            tokenRepository.delete((token));
            System.out.println("Token expirado y eliminado");

            return "expired";
        }

        user.setEnabled(true);
        try {
            userRepo.save(user);
            System.out.println("Usuario actualizado. Nuevo estado: " + user.isEnabled());

            tokenRepository.delete(token);
            return "valido";
        }catch (Exception e){
            System.out.println("Error al guardar usuario: " + e.getMessage());
            e.printStackTrace();

            return "Error al actualizar el usuario";
        }
    }
}

package com.tienda.Tienda.Controller;

import com.tienda.Tienda.Service.Auth.AuthService;

import com.tienda.Tienda.Service.Auth.AuthServiceImpl;
import com.tienda.Tienda.Token.VerificationToken;
import com.tienda.Tienda.Token.VerificationTokenRepository;
import com.tienda.Tienda.Util.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth/")
@RequiredArgsConstructor

public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthServiceImpl userService;

    @Autowired
    private VerificationTokenRepository tokenRepository;


    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto>login(@RequestBody AuthRequestDto authRequestDto){

        try {
            var jwtToken = authService.login(authRequestDto.username(), authRequestDto.password());
            var authResponseDto = new AuthResponseDto(jwtToken, AuthStatus.LOGIN_SUCCESS, "Inicio de sesión exitoso.");

            return ResponseEntity.status(HttpStatus.OK).body(authResponseDto);

        }catch (Exception e){
            String errorMessage = e.getMessage();
            AuthStatus status = AuthStatus.LOGIN_FAILDED;

            e.printStackTrace();

            if (e.getMessage().contains("Usuario no encontrado")){
                errorMessage = "Usuario no encontrado";
            } else if (e.getMessage().contains("La cuenta no ha sido verificada")) {
                errorMessage = "La cuenta no ha sido verificada. Por favor revise su correo electronico";
            }else if (e.getMessage().contains("Bad credentials")) {
                errorMessage = "Usuario o contraseña incorrecta";
            }

            var authResponseDto = new AuthResponseDto(null, status, errorMessage);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(authResponseDto);

        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponseDto>signUp(@RequestBody AuthRequestDto authRequestDto){

        try {
            var jwtToken = authService.singnUp(authRequestDto.nombre(), authRequestDto.username(), authRequestDto.password(), authRequestDto.email());

            var authResponseDto = new AuthResponseDto(jwtToken, AuthStatus.USER_CREATED_SUCCESSFULLY, "Usuario creado con exito. Por favor, revise su correo electronico, verifique su cuenta.");

            return ResponseEntity.status(HttpStatus.OK).body(authResponseDto);

        }catch (Exception e){
            String errorMessage = e.getMessage();
            AuthStatus status = AuthStatus.USER_NOT_CREATED;

            e.printStackTrace();

            if (e.getMessage().contains("Username already exists")){
                errorMessage = "El nombre de usuario ya está en uso";
            } else if (e.getMessage().contains("Email already exists")) {
                errorMessage = "El correo electronico ya está registrado";
            }

            var authResponseDto = new AuthResponseDto(null, status, errorMessage);

            return ResponseEntity.status(HttpStatus.CONFLICT).body(authResponseDto);

        }

    }

    @GetMapping("/verifyEmail")
    public void verifyEmail(@RequestParam("token") String token, HttpServletResponse response) throws IOException{

        System.out.println("Recibida la solicitud de verificacion para el token" + token);

        try {
            VerificationToken theToken = tokenRepository.findByToken(token);

            if(theToken == null){
                System.out.println("Token no encontrado");
                response.sendRedirect("http://localhost:3000/verification?status=invalid-token");
                return;
            }

            String result = userService.validateToken(token);
            System.out.println("Resultado de la validacion: " + result);

            switch (result){

                case"valido": response.sendRedirect("http://localhost:3000/verification?status=success"); break;

                case "expired": response.sendRedirect(("http://localhost:3000/verification?status=expired")); break;

                default: response.sendRedirect("http://localhost:3000/verification?status=error");

            }
        }catch(Exception e){
            System.out.println("Error durante la verificación" + e.getMessage());
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/verification?status=error");
        }

    }

    public String applicationUrl(HttpServletRequest request){
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestBody String expiredToken) {
        System.out.println("Token recibido para refresh: '" + expiredToken + "'");
        expiredToken = expiredToken.trim(); // elimina espacios por si acaso
        try {
            Optional<Claims> claims = JwtUtils.parseToken(expiredToken);
            if (claims.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        new AuthResponseDto(null, AuthStatus.LOGIN_FAILDED, "Token inválido o expirado.")
                );
            }
            String username = claims.get().getSubject();
            String newToken = JwtUtils.generateToken(username);

            return ResponseEntity.ok(new AuthResponseDto(newToken, AuthStatus.LOGIN_SUCCESS, "Token renovado."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new AuthResponseDto(null, AuthStatus.LOGIN_FAILDED, "Error al renovar token.")
            );
        }
    }



}

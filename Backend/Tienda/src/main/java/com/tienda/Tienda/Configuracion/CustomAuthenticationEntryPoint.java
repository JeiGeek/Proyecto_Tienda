package com.tienda.Tienda.Configuracion;

// Librerias utilizadas de springboot
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
//-----------------------------------------

// Librerias utilizadas de java
import java.io.IOException;
//-----------------------------------------

// Esta clase se utiliza cuando alguien no autorizado quiera ingresar
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    //Se ejecuta automáticamente cuando alguien intenta entrar sin estar autenticado
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {

        //Envia el error del acceso no permitido
        response.sendError(HttpStatus.UNAUTHORIZED.value(), authException.getMessage());
    }
}

/*
@Component → Marca esta clase como un componente que Spring debe detectar y usar automáticamente.
@Override  → Indica que este metodo está sobrescribiendo una versión anterior de la interfaz AuthenticationEntryPoint.
             (No es de Spring, sino de Java).
 */

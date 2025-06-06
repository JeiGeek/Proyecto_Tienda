package com.tienda.Tienda.Configuracion;

/*
Filtro de seguridad personalizado que intercepta cada solicitud web para revisar si lleva un token JWT válido.
Si lo lleva y es válido, deja que el usuario acceda. Si no, pasa la solicitud sin autenticar.
 */

import com.tienda.Tienda.Util.JwtUtils;
// Librerias utilizadas de springboot
import org.springframework.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
//-----------------------------------------

// Librerias utilizadas de java
import java.io.IOException;
import java.util.Optional;
//-----------------------------------------

// Filtro que se ejecutará una vez por cada solicitud HTTP.
@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    //Inyeccion de la variable la clase a utilizar
    @Autowired
    private UserDetailsService userDetailsService;
    private JwtUtils JwtUtils; //en prueba

    //Se ejecuta cuando llega una instruccion:
    // request: Es la solicitud que el usuario hace
    // response: La respuesta que se dará
    // filterChain: Permite seguir con el siguiente filtro si este no bloquea la solicitud
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        Optional<String> jwtTokenOptional = getTokenFromRequest(request);

        if (jwtTokenOptional.isPresent()) {
            String jwtToken = jwtTokenOptional.get();

            // Si es el endpoint de refresh-token, permitimos incluso si el token está expirado
            if (path.contains("/api/auth/refresh-token")) {
                // Aquí no validamos si el token expiró, solo si la firma es válida
                Optional<String> usernameOptional = JwtUtils.getUsernameFromToken(jwtToken);
                if (usernameOptional.isPresent()) {
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            // Para otros endpoints
            if (JwtUtils.validateToken(jwtToken)) {
                Optional<String> usernameOptional = JwtUtils.getUsernameFromToken(jwtToken);
                if (usernameOptional.isPresent()) {
                    var userDetails = userDetailsService.loadUserByUsername(usernameOptional.get());

                    var authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } else {
                // Token inválido o expirado
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Optional<String> getTokenFromRequest(HttpServletRequest request) {
        var authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return Optional.of(authHeader.substring(7));
        }
        return Optional.empty();
    }
}

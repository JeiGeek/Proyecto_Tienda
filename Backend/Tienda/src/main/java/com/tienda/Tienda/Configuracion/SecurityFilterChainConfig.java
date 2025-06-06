package com.tienda.Tienda.Configuracion;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;


@Configuration
public class SecurityFilterChainConfig {
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final JWTAuthenticationFilter jwtAuthenticationFilter;

    public SecurityFilterChainConfig(AuthenticationEntryPoint authenticationEntryPoint, JWTAuthenticationFilter jwtAuthenticationFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception
    {
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable);

        httpSecurity.authorizeHttpRequests(
                requestMatcher -> requestMatcher
                        // Rutas públicas
                        .requestMatchers("/api/auth/login**").permitAll()
                        .requestMatchers("/api/auth/registrar/**").permitAll()
                        .requestMatchers("/api/auth/verifyEmail/**").permitAll()
                        .requestMatchers("/api/uploads/**").permitAll()

                        // Productos: abiertos o restringidos según caso
                        .requestMatchers("/api/productos/**").permitAll()

                        // Usuarios
                        // Solo ADMIN puede eliminar usuarios
                        .requestMatchers("/api/usuario/eliminar/**").permitAll()

                        // Usuario actualiza sus datos
                        .requestMatchers("/api/usuario/actualizar/**").permitAll()

                        // Admin actualiza datos de usuario
                        .requestMatchers("/api/usuario/actualizar_user/**").permitAll()

                        // Para el perfil del usuario autenticado (ver y actualizar perfil) permitimos usuario autenticado
                        .requestMatchers("/api/usuario/perfil/**").authenticated()

                        // React revisa el estado admin
                        .requestMatchers("/api/usuario/admin/**").authenticated()

                        // Para listar usuarios
                        .requestMatchers("/api/usuario").permitAll()

                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated()
        )

        .exceptionHandling(
                exceptionConfig -> exceptionConfig.authenticationEntryPoint(authenticationEntryPoint)

        )

        .sessionManagement(
                sessionConfig -> sessionConfig.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)

        )

        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
@Bean
    public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**",configuration);
    return source;
}
}



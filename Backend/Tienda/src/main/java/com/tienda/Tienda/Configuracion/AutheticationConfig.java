package com.tienda.Tienda.Configuracion;

/*
Esta clase prepara el inicio de sesion del usuario, teniendo presente donde están guardados lo datos
del usuario, como verificar su contraseña de una manera segura y decide si lo deja ingresar o no.
 */

// Librerias utilizadas de springboot
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
//-----------------------------------------

//Clase que va a configurar la autenticacion del inicio de sesión
@Configuration
public class AutheticationConfig {

    //Este metodo le dice a Spring cómo obtener el manager que se encarga de revisar si los usuarios están bien autenticados.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }

    // Este metodo define cómo se va a autenticar al usuario como de donde salen
    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder){
        //Proveedor de autenticación que va a usar la base de datos
        var authenticationProvide = new DaoAuthenticationProvider();
        //Donde buscar los datos
        authenticationProvide.setUserDetailsService(userDetailsService);
        //Tipo de codificacion de contraseña usar para compararlas
        authenticationProvide.setPasswordEncoder(passwordEncoder);

        return authenticationProvide;
    }

    //Codificador de contraseñas con BCrypt.
    @Bean
    public PasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}

/*
@Configuration → Indica que la clase contiene configuraciones que Spring debe cargar y gestionar.
@Bean → Declara que el metodo produce un objeto (una herramienta) que Spring debe guardar y usar cuando lo necesite.
 */
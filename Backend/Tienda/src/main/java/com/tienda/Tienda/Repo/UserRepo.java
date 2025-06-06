package com.tienda.Tienda.Repo;

import com.tienda.Tienda.Modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Usuario, Long> {

    boolean existsByUsername(String username);

    Optional<Usuario>findByUsername(String username);

    boolean existsByEmail(String email);

    Optional<Usuario> findByEmail(String email);

}

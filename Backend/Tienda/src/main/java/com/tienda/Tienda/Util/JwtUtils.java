package com.tienda.Tienda.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.DateUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Slf4j
public class JwtUtils {
    private static final String SECRET = "mi_clave_secreta_muy_segura_de_al_menos_256_bits_aaaaa12345";
    private static final SecretKey secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private static final String ISSUER = "server";

    private JwtUtils(){}

    public static boolean validateToken(String jwtToken){
        return parseToken(jwtToken).isPresent();
    }

    public static Optional<Claims> parseToken(String jwtToken){
        var jwtParse = Jwts.parser().verifyWith(secretKey).build();

        try {
            return Optional.of(jwtParse.parseSignedClaims(jwtToken).getPayload());
        } catch (ExpiredJwtException e) {
            // Token expirado, pero devolvemos los claims para manejo (ej: refresh)
            return Optional.ofNullable(e.getClaims());
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT Exception ocurred: " + e.getMessage());
        }
        return Optional.empty();
    }

    public static Optional<String> getUsernameFromToken( String jwtToken){
        var ClaimsOptional = parseToken(jwtToken);
        return ClaimsOptional.map(Claims::getSubject);
    }

    public static String generateToken (String username){
        var currentDate = new Date();
        var jwtExpirationInMinutes = 99;
        var expiration = DateUtils.addMinutes(currentDate,jwtExpirationInMinutes);

        return Jwts.builder().id(UUID.randomUUID().toString()).issuer(ISSUER).subject(username).signWith(secretKey).issuedAt(currentDate).expiration(expiration).compact();
    }
}


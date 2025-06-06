package com.tienda.Tienda.Token;

import com.tienda.Tienda.Modelos.Usuario;
import jakarta.persistence.*;

import java.util.Calendar;
import java.util.Date;

@Entity
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private  String token;

    @Column(nullable = false)
    private Date expirationTme;

    private static final int EXPIRATION_TIME = 30;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private Usuario user;


    public VerificationToken(){

    }


    public VerificationToken(String token, Usuario user) {
        this.token = token;
        this.user = user;
        this.expirationTme = calculateExpirationTime();
    }


    private  Date calculateExpirationTime(){
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, EXPIRATION_TIME);
        return calendar.getTime();
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpirationTme() {
        return expirationTme;
    }

    public void setExpirationTme(Date expirationTme) {
        this.expirationTme = expirationTme;
    }

    public Usuario getUser() {
        return user;
    }

    public void setUser(Usuario user) {
        this.user = user;
    }
}

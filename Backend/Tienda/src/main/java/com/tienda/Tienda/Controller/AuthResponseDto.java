package com.tienda.Tienda.Controller;

public record AuthResponseDto (String token, AuthStatus authStatus, String message) {

}

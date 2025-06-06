package com.tienda.Tienda.Listener;

import com.tienda.Tienda.Modelos.Usuario;
import com.tienda.Tienda.Service.Auth.AuthServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {

    private static final Logger log = LoggerFactory.getLogger(RegistrationCompleteEventListener.class);

    @Autowired
    private AuthServiceImpl userService;

    @Autowired
    private JavaMailSender mailSender;
    private Usuario theUser;


    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event){

        theUser = event.getUser();

        String verificationToken = UUID.randomUUID().toString();

        userService.saveUserVerficationToken(theUser, verificationToken);

        String url = "http://localhost:8080/api/auth/verifyEmail?token=" + verificationToken;


        try {
            sendVerificationEmail(url);
        }catch (MessagingException | UnsupportedEncodingException e){

            throw new RuntimeException();
        }

        log.info("Haga clic en el enlace para verificar su registro: ()", url);

    }


    public void  sendVerificationEmail(String url) throws MessagingException,UnsupportedEncodingException{

        String subject = "Verificacion de Correo Electronico";
        String senderName = "Servicio de Registro de Usuarios";
        String mailContent = "<p>Hola, " + theUser.getNombre() + "</p>"
                             + "<p>Gracias por registrarte con nosotros.</p>"
                             + "<p>Por favor, haz clic en el enlace a continuación para completar el registro:</p>"
                             + "<a href=\"" + url + "\">Verifica tu correo electrónico para activar tu cuenta</a>"
                             + "<p> Gracias, <br> Servicio de Registro de usuarios </p>";

        MimeMessage message = mailSender.createMimeMessage();
        var messageHelper = new MimeMessageHelper(message);

        messageHelper.setFrom("kirfer9@gmail.com", senderName);
        messageHelper.setTo(theUser.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);

        mailSender.send(message);
    }

}

package login_mfa.autenticacion2f2.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

  private final JavaMailSender mailSender;

  @Value("${app.mail.from:noreply@loginmfa.local}")
  private String from;

  public MailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  public void sendOtp(String toEmail, int code, int minutes) {
    String code6 = String.format("%06d", code);

    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(from);
    msg.setTo(toEmail);
    msg.setSubject("Tu código OTP");
    msg.setText("""
        Hola,

        Tu código de verificación es: %s
        Este código expira en %d minutos.

        Si no solicitaste este código, ignora este mensaje.
        """.formatted(code6, minutes));

    mailSender.send(msg);
  }
}

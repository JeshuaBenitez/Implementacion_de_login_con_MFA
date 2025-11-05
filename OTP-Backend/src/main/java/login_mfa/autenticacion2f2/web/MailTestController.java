package login_mfa.autenticacion2f2.web;

import login_mfa.autenticacion2f2.service.MailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class MailTestController {

  private final MailService mail;

  public MailTestController(MailService mail) { this.mail = mail; }

  @PostMapping("/mail")
  public ResponseEntity<?> send(@RequestParam String to) {
    mail.sendOtp(to, 123456, 5);
    return ResponseEntity.ok().build();
  }
}

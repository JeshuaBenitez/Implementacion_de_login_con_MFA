package login_mfa.autenticacion2f2.web;

import login_mfa.autenticacion2f2.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

  private final OtpService otpService;

  public AuthController(OtpService otpService) { this.otpService = otpService; }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> body, @RequestHeader(value="User-Agent", required=false) String ua) {
    var res = otpService.register(
        body.getOrDefault("name",""),
        body.getOrDefault("lastname",""),
        body.getOrDefault("email",""),
        body.getOrDefault("password",""),
        ua
    );
    return ResponseEntity.status(201).body(res);
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> body, @RequestHeader(value="User-Agent", required=false) String ua) {
    var res = otpService.login(body.getOrDefault("email",""), body.getOrDefault("password",""), ua);
    return ResponseEntity.ok(res);
  }

  @PostMapping("/resend-otp")
  public ResponseEntity<?> resend(@RequestBody Map<String, String> body, @RequestHeader(value="User-Agent", required=false) String ua) {
    otpService.resendOtp(body.getOrDefault("email",""), ua);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
    int code = Integer.parseInt(body.getOrDefault("code","-1"));
    otpService.verifyOtp(body.getOrDefault("email",""), code);
    return ResponseEntity.ok(Map.of("verified", true));
  }
}

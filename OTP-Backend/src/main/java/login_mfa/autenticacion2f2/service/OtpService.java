package login_mfa.autenticacion2f2.service;

import login_mfa.autenticacion2f2.domain.CodigoOtp;
import login_mfa.autenticacion2f2.domain.Usuario;
import login_mfa.autenticacion2f2.repo.CodigoOtpRepository;
import login_mfa.autenticacion2f2.repo.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

  private final UsuarioRepository usuarioRepo;
  private final CodigoOtpRepository otpRepo;
  private final MailService mailService;          // ⬅️ nuevo
  private final Random random = new Random();

  public OtpService(UsuarioRepository u, CodigoOtpRepository o, MailService mailService) {
    this.usuarioRepo = u;
    this.otpRepo = o;
    this.mailService = mailService;
  }

  private int gen6() {
    return random.nextInt(1_000_000); // 0..999999
  }

  // corta/normaliza el user-agent para que no reviente el VARCHAR
  private static String normalizeDevice(String device) {
    String d = (device != null && !device.isBlank()) ? device : "desconocido";
    return d.length() > 255 ? d.substring(0, 255) : d;
  }

  @Transactional
  public Map<String, Object> register(String nombre, String apellido, String correo, String contraseniaPlano, String device) {
    if (usuarioRepo.existsByCorreo(correo)) {
      throw new IllegalArgumentException("Correo ya registrado");
    }
    Usuario u = new Usuario();
    u.setNombre(nombre);
    u.setApellido(apellido);
    u.setCorreo(correo);
    u.setContrasenia(BCrypt.hashpw(contraseniaPlano, BCrypt.gensalt()));
    usuarioRepo.save(u);

    int code = generarYGuardarOtp(u, device);
    mailService.sendOtp(correo, code, 5);        // ⬅️ envía correo
    return Map.of("email", correo);
  }

  @Transactional
  public Map<String, Object> login(String correo, String contraseniaPlano, String device) {
    Usuario u = usuarioRepo.findByCorreo(correo)
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    if (!BCrypt.checkpw(contraseniaPlano, u.getContrasenia())) {
      throw new IllegalArgumentException("Credenciales inválidas");
    }
    int code = generarYGuardarOtp(u, device);
    mailService.sendOtp(correo, code, 5);        // ⬅️ envía correo
    return Map.of("email", correo);
  }

  @Transactional
  public void resendOtp(String correo, String device) {
    Usuario u = usuarioRepo.findByCorreo(correo)
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    int code = generarYGuardarOtp(u, device);
    mailService.sendOtp(correo, code, 5);        // ⬅️ envía correo
  }

  @Transactional
  public void verifyOtp(String correo, int codigo) {
    Usuario u = usuarioRepo.findByCorreo(correo)
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    CodigoOtp otp = otpRepo.findActivoPorUsuarioYCodigo(u, codigo, Instant.now())
        .orElseThrow(() -> new IllegalArgumentException("Código inválido o expirado"));
    otp.setUsado(true);
    otpRepo.save(otp);
  }

  private int generarYGuardarOtp(Usuario u, String device) {
    int code = gen6();
    Instant now = Instant.now();
    CodigoOtp otp = new CodigoOtp();
    otp.setUsuario(u);
    otp.setCodigo(code);
    otp.setFechaCreacion(now);
    otp.setFechaExpiracion(now.plus(5, ChronoUnit.MINUTES));
    otp.setUsado(false);
    otp.setDispositivo(normalizeDevice(device));
    otpRepo.save(otp);
    return code;                                   // ⬅️ devolvemos el OTP
  }
}

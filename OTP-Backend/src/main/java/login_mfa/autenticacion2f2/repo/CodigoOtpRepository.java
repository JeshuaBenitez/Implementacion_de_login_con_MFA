package login_mfa.autenticacion2f2.repo;

import login_mfa.autenticacion2f2.domain.CodigoOtp;
import login_mfa.autenticacion2f2.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Optional;

public interface CodigoOtpRepository extends JpaRepository<CodigoOtp, Long> {

  @Query("""
    select c from CodigoOtp c
    where c.usuario = :usuario
      and c.usado = false
      and c.fechaExpiracion > :now
      and c.codigo = :codigo
  """)
  Optional<CodigoOtp> findActivoPorUsuarioYCodigo(Usuario usuario, Integer codigo, Instant now);
}

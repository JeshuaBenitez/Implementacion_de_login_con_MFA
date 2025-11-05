package login_mfa.autenticacion2f2.repo;

import login_mfa.autenticacion2f2.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByCorreo(String correo);
  boolean existsByCorreo(String correo);
}

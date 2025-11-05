package login_mfa.autenticacion2f2.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(length = 50)
    private String apellido;

    // Guarda el HASH (BCrypt) de la contraseña
    @Column(name = "contrasenia", nullable = false, length = 120)
    private String contrasenia;

    @Column(nullable = false, unique = true, length = 120)
    private String correo;

    @Column(name = "fecha_creacion", nullable = false)
    private Instant fechaCreacion = Instant.now();

    @Column(nullable = false)
    private Boolean enabled = true;

    // ---- getters y setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getContrasenia() { return contrasenia; }
    public void setContrasenia(String contrasenia) { this.contrasenia = contrasenia; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public Instant getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Instant fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

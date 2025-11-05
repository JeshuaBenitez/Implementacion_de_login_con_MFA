package login_mfa.autenticacion2f2.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "codigo_otp")
public class CodigoOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_otp")
    private Long id;

    // 6 dígitos 000000–999999
    @Column(nullable = false)
    private Integer codigo;

    @Column(name = "fecha_creacion", nullable = false)
    private Instant fechaCreacion = Instant.now();

    @Column(name = "fecha_expiracion", nullable = false)
    private Instant fechaExpiracion;

    @Column(nullable = false)
    private Boolean usado = false;

    @Column(nullable = false, length = 255)
    private String dispositivo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    // ---- getters y setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getCodigo() { return codigo; }
    public void setCodigo(Integer codigo) { this.codigo = codigo; }

    public Instant getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Instant fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public Instant getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(Instant fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }

    public Boolean getUsado() { return usado; }
    public void setUsado(Boolean usado) { this.usado = usado; }

    public String getDispositivo() { return dispositivo; }
    public void setDispositivo(String dispositivo) { this.dispositivo = dispositivo; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../api/http";

export default function Register(){
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const normEmail = (e) => (e || "").trim().toLowerCase();

  function handleChange(e){
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "email") setError(""); // limpia el error al editar el email
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("Completa todos los campos.");
    }
    if (form.password !== form.confirm) {
      return setError("Las contraseñas no coinciden.");
    }

    setLoading(true);
    try {
      const body = {
        name: form.name.trim(),
        email: normEmail(form.email),
        password: form.password,
      };

      const res = await apiPost("/auth/register", body);
      const email = (res && res.email) || body.email;
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const msg = err?.message || "No se pudo registrar.";
      // Mensaje claro para correo ya existente
      if (msg.toLowerCase().includes("correo ya registrado")) {
        setError("Este correo ya está registrado. Inicia sesión.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/60 backdrop-blur p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6">Crear cuenta</h1>

        {error && <div className="mb-4 text-sm text-rose-400">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm text-slate-300">Nombre</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm text-slate-300">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@company.com" required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm text-slate-300">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>

          <div>
            <label htmlFor="confirm" className="block mb-2 text-sm text-slate-300">Confirmar contraseña</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input id="terms" type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-900 focus:ring-primary-600" />
            Acepto los <a className="text-primary-400 hover:text-primary-300 underline" href="#">Términos y Condiciones</a>
          </label>

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 text-white font-medium py-2.5 transition">
            {loading ? "Enviando..." : "Crear una cuenta"}
          </button>

          <p className="text-sm text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

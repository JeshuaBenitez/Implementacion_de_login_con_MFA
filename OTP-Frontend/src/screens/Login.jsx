import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../api/http";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, type, value, checked } = e.target; // <-- checked (no 'cheked')
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Completa email y contraseña.");
    setLoading(true);
    try {
      // POST /api/auth/login (ajusta si tu ruta es otra)
      const res = await apiPost("/auth/login", {
        email: form.email,
        password: form.password,
        remember: form.remember,
      });
      const email = (res && res.email) || form.email;
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || "Error de autenticación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/60 backdrop-blur p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6">Iniciar sesión</h1>

        {error && <div className="mb-4 text-sm text-rose-400">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm text-slate-300">Email</label>
            <input
              id="email" name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="tucorreo@dominio.com" required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm text-slate-300">Contraseña</label>
            <input
              id="password" name="password" type="password" value={form.password} onChange={handleChange} required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              name="remember" type="checkbox" checked={form.remember} onChange={handleChange}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 focus:ring-primary-600"
            />
            Recordarme
          </label>

          <button
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 text-white font-medium py-2.5 transition"
          >
            {loading ? "Enviando..." : "Entrar"}
          </button>

          <div className="h-px bg-slate-700 my-3" />

          <p className="text-sm text-slate-400">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 underline">
              Crear una cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

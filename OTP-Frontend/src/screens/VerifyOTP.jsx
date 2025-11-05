// src/screens/VerifyOTP.jsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

async function postJSON(path, body) {
  const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = "Error en la solicitud";
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({}));
}

export default function VerifyOTP() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = (search.get("email") || "").trim().toLowerCase();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[idx] = value;
    setCode(next);
    if (value && idx < CODE_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(text)) return;
    setCode(text.split("").slice(0, CODE_LENGTH));
  };

  // Limpia OTP y enfoca el primer input
  function clearCodeAndFocus() {
    setCode(Array(CODE_LENGTH).fill(""));
    setTimeout(() => inputsRef.current[0]?.focus(), 0);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setOkMsg("");

    const token = code.join("");
    if (token.length !== CODE_LENGTH || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await postJSON("/auth/verify-otp", {
        email: emailParam,
        code: Number(token),
      });
      setOkMsg("Código verificado. Redirigiendo…");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setErrorMsg(err.message || "No se pudo verificar el código.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || isSubmitting) return;
    setErrorMsg("");
    setOkMsg("");
    setSeconds(RESEND_SECONDS);
    clearCodeAndFocus(); // ⬅️ Limpia dígitos y vuelve a enfocar

    try {
      await postJSON("/auth/resend-otp", { email: emailParam });
      setOkMsg("Nuevo código enviado. Revisa tu correo.");
    } catch (err) {
      setErrorMsg(err.message || "No se pudo reenviar el código.");
      setSeconds(0); // permite reintentar antes si falló
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/60 backdrop-blur p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Verificación de código</h1>
        <p className="text-sm text-slate-400 mt-1">
          Ingresa el código de 6 dígitos enviado a{" "}
          <span className="text-slate-200 font-medium">{emailParam || "tu correo"}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-xl font-semibold
                           rounded-lg border border-slate-600 bg-slate-900 text-slate-100
                           focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || code.join("").length !== CODE_LENGTH}
            className="w-full rounded-lg bg-primary-600 hover:bg-primary-700
                       disabled:opacity-50 text-white font-medium py-2.5 transition"
          >
            {isSubmitting ? "Verificando…" : "Verificar código"}
          </button>

          {okMsg && <p className="text-sm text-emerald-400">{okMsg}</p>}
          {errorMsg && <p className="text-sm text-rose-400">{errorMsg}</p>}

          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-slate-400">¿No recibiste el código?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={seconds > 0 || isSubmitting}
              className="text-primary-400 hover:text-primary-300 disabled:opacity-50 underline"
            >
              {seconds > 0 ? `Reenviar en ${seconds}s` : "Reenviar código"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

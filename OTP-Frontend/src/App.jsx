import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import VerifyOTP from "./screens/VerifyOTP";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <BrowserRouter>
        <nav className="border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4">
            <a href="/login" className="text-slate-200 hover:text-white">Login</a>
            <a href="/register" className="text-slate-200 hover:text-white">Register</a>
          </div>
        </nav>

        <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyOTP />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

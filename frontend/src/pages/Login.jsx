import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Dang nhap that bai.");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[40%,60%]">
      <div className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#1E1B4B_0%,#4C1D95_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -left-8 top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="relative z-10 max-w-md">
          <div className="text-6xl">📚</div>
          <h1 className="mt-6 text-4xl font-bold">UniLib System</h1>
          <p className="mt-3 text-indigo-200">He thong quan ly thu vien dai hoc thong nhat cho nha truong.</p>
          <div className="mt-10 space-y-4 text-indigo-100">
            <div>✓ Quan ly sach va ban sao khoa hoc</div>
            <div>✓ Theo doi muon tra sach theo dung business rules</div>
            <div>✓ Bao cao thong ke truc quan cho nha truong</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-800">Chao mung tro lai</h2>
          <p className="mt-2 text-slate-400">Dang nhap de tiep tuc su dung UniLib System</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label-ui">Username</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-ui pl-10"
                  value={form.username}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-ui">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-ui pl-10 pr-10"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

            <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700" disabled={loading} type="submit">
              {loading ? "Dang xu ly..." : "Dang nhap"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            <div>Admin: `admin / admin123`</div>
            <div>Librarian: `librarian1 / lib123`</div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-300">© 2024 UniLib System</div>
        </div>
      </div>
    </div>
  );
}

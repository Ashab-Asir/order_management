import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    adminSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      if (form.role === "USER") {
        await api.post("/auth/register-user", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setSuccessMsg("User registered successfully. You can login now.");
      } else {
        await api.post("/auth/register-admin", {
          name: form.name,
          email: form.email,
          password: form.password,
          adminSecret: form.adminSecret,
        });
        setSuccessMsg("Admin registered successfully. You can login now.");
      }
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Create an account
        </h1>
        <p className="text-xs text-center text-slate-500 mb-4">
          Choose role and fill the form. Admin signup requires a secret code.
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Register as</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {form.role === "ADMIN" && (
            <div>
              <label className="block text-sm mb-1">Admin secret code</label>
              <input
                type="password"
                name="adminSecret"
                value={form.adminSecret}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                This must match <code>ADMIN_REGISTRATION_SECRET</code> in the
                backend.
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMsg && (
            <p className="text-emerald-600 text-sm text-center">{successMsg}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-lg py-2 mt-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

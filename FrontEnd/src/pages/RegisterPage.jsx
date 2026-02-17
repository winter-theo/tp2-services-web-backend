import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await register(form);
      setSuccess("Compte créé. Tu peux te connecter.");
      setTimeout(() => navigate("/login"), 700);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="card auth-card">
        <h1>Inscription</h1>
        <form onSubmit={onSubmit} className="form">
          <input
            type="email"
            placeholder="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer compte"}
          </button>
        </form>
        <ApiStatus error={error} success={success} />
        <p>
          Déjà un compte ? <Link to="/login">Connexion</Link>
        </p>
      </section>
    </main>
  );
}

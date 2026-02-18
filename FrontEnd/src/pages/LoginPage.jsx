import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={user?.role === "ADMIN" ? "/admin/articles" : "/articles"} replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email, password);
      const redirectPath = result?.user?.role === "ADMIN" ? "/admin/articles" : "/articles";
      navigate(redirectPath, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="card auth-card">
        <h1>Connexion</h1>
        <p className="hint">JWT sur `Authorization: Bearer ...`</p>
        <form onSubmit={onSubmit} className="form">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <ApiStatus error={error} />
        <p>
          Pas de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </section>
    </main>
  );
}

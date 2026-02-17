import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Connecté en tant que {user?.email}</p>
      <p className="hint">Commence par naviguer vers les modules métier.</p>
      <div className="quick-grid">
        <Link to="/articles" className="tile">
          Articles
        </Link>
        <Link to="/fish" className="tile">
          Fish
        </Link>
        <Link to="/messages" className="tile">
          Messages
        </Link>
        {user?.role === "ADMIN" ? (
          <Link to="/admin" className="tile">
            Admin
          </Link>
        ) : null}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listUsers } from "../api/admin";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listUsers(token);
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token]);

  return (
    <div>
      <h1>Admin</h1>
      <p className="hint">Page accessible uniquement aux `ADMIN`.</p>
      <div className="row">
        <Link className="inline-link" to="/admin/articles">
          Gérer les articles
        </Link>
        <Link className="inline-link" to="/admin/fish">
          Gérer les fiches poisson
        </Link>
      </div>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      <ul className="simple-list">
        {users.map((user) => (
          <li key={user.id}>
            {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

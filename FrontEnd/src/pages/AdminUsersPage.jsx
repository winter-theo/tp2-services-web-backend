import { useEffect, useState } from "react";
import { deleteUser, listUsers } from "../api/admin";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function AdminUsersPage() {
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

  const onDelete = async (userId) => {
    const confirmed = window.confirm("Supprimer cet utilisateur ?");
    if (!confirmed) {
      return;
    }
    setError("");
    try {
      await deleteUser(userId, token);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Admin - Users</h1>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      <ul className="simple-list">
        {users.map((user) => (
          <li key={user.id} className="list-row">
            <span>
              {user.email} - {user.role}
            </span>
            <button
              type="button"
              className="icon-action icon-delete"
              onClick={() => onDelete(user.id)}
              title="Supprimer"
              aria-label="Supprimer"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

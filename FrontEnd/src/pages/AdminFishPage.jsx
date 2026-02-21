import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteFish, listFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function AdminFishPage() {
  const { token } = useAuth();
  const [fishList, setFishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listFish({}, token);
        setFishList(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token]);

  const onDelete = async (fishId) => {
    const confirmed = window.confirm("Supprimer cette fiche poisson ?");
    if (!confirmed) {
      return;
    }
    setError("");
    try {
      await deleteFish(fishId, token);
      setFishList((prev) => prev.filter((fish) => fish.id !== fishId));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Admin - Fish</h1>
      <div className="row">
        <Link className="button-link" to="/admin/fish/create">
          Créer une fiche poisson
        </Link>
      </div>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      <ul className="simple-list">
        {fishList.map((fish) => (
          <li key={fish.id} className="list-row">
            <span>
              <strong>{fish.name}</strong>
            </span>
            <span className="row compact admin-actions">
              <Link
                className="icon-action"
                to={`/admin/fish/${fish.id}`}
                title="Voir"
                aria-label="Voir"
              >
                👁
              </Link>
              <Link
                className="icon-action"
                to={`/admin/fish/${fish.id}/edit`}
                title="Modifier"
                aria-label="Modifier"
              >
                ✏️
              </Link>
              <button
                type="button"
                className="icon-action icon-delete"
                onClick={() => onDelete(fish.id)}
                title="Supprimer"
                aria-label="Supprimer"
              >
                🗑️
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

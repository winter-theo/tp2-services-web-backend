import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function AdminFishViewPage() {
  const { token } = useAuth();
  const { fishId } = useParams();
  const [fish, setFish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getFish(fishId, token);
        setFish(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [fishId, token]);

  return (
    <div>
      <h1>Voir fiche poisson</h1>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {fish ? (
        <div className="stack">
          <p>
            <strong>Nom:</strong> {fish.name}
          </p>
          <p>
            <strong>Description:</strong>
          </p>
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: fish.description || "" }} />
          <div className="row">
            <Link className="inline-link" to={`/admin/fish/${fish.id}/edit`}>
              Modifier
            </Link>
            <Link className="inline-link" to="/admin/fish">
              Retour liste
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

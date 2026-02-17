import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function FishDetailPage() {
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
      <h1>Détail poisson</h1>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {fish ? (
        <article className="sub-card">
          <h2>{fish.name}</h2>
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: fish.description || "" }} />
        </article>
      ) : null}
      <div className="row">
        <Link className="inline-link" to="/fish">
          Retour à la liste alphabétique
        </Link>
      </div>
    </div>
  );
}

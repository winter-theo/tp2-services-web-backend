import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFish, updateFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import FishForm from "../components/FishForm";
import { useAuth } from "../context/AuthContext";

export default function AdminFishEditPage() {
  const { token } = useAuth();
  const { fishId } = useParams();
  const navigate = useNavigate();
  const [fish, setFish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getFish(fishId, token);
        setFish({
          name: data.name,
          description: data.description,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [fishId, token]);

  const onUpdate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await updateFish(fishId, payload, token);
      navigate(`/admin/fish/${fishId}`, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Modifier fiche poisson</h1>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {!loading && fish ? (
        <FishForm
          initialValues={fish}
          onSubmit={onUpdate}
          submitLabel="Enregistrer"
          loading={submitting}
          richDescription
        />
      ) : null}
      <div className="row">
        <Link className="inline-link" to="/admin/fish">
          Retour liste
        </Link>
      </div>
    </div>
  );
}

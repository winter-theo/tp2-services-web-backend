import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import FishForm from "../components/FishForm";
import { useAuth } from "../context/AuthContext";

export default function AdminFishCreatePage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onCreate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      const created = await createFish(payload, token);
      navigate(`/admin/fish/${created.id}`, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Créer une fiche poisson</h1>
      <ApiStatus error={error} />
      <FishForm
        initialValues={{}}
        onSubmit={onCreate}
        submitLabel="Créer fiche"
        loading={submitting}
      />
    </div>
  );
}

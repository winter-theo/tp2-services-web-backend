import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../api/articles";
import { listFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import ArticleForm from "../components/ArticleForm";
import { useAuth } from "../context/AuthContext";

export default function AdminArticleCreatePage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [fishOptions, setFishOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listFish({}, token);
        setFishOptions(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token]);

  const onCreate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      const created = await createArticle(payload, token);
      navigate(`/admin/articles/${created.id}`, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Créer un article</h1>
      <ApiStatus error={error} />
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ArticleForm
          fishOptions={fishOptions}
          initialValues={{}}
          onSubmit={onCreate}
          submitLabel="Créer article"
          loading={submitting}
          richContent
        />
      )}
    </div>
  );
}

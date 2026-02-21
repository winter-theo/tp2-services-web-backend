import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getArticle, updateArticle } from "../api/articles";
import { listFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import ArticleForm from "../components/ArticleForm";
import { useAuth } from "../context/AuthContext";

export default function AdminArticleEditPage() {
  const { token } = useAuth();
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [fishOptions, setFishOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const [articleData, fishData] = await Promise.all([
          getArticle(articleId, token),
          listFish({}, token),
        ]);

        setArticle({
          id: articleData.id,
          title: articleData.title,
          content: articleData.content,
          status: articleData.status,
          fishIds: Array.isArray(articleData.fishes)
            ? articleData.fishes.map((entry) => entry.fishId)
            : [],
        });
        setFishOptions(Array.isArray(fishData) ? fishData : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [articleId, token]);

  const onUpdate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await updateArticle(articleId, payload, token);
      navigate(`/admin/articles/${articleId}`, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Modifier article</h1>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {!loading && article ? (
        <ArticleForm
          fishOptions={fishOptions}
          initialValues={article}
          onSubmit={onUpdate}
          submitLabel="Enregistrer"
          loading={submitting}
          richContent
          className="form-wide"
        />
      ) : null}
      <div className="row">
        <Link className="inline-link" to="/admin/articles">
          Retour liste
        </Link>
      </div>
    </div>
  );
}

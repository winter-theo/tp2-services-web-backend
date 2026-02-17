import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticle } from "../api/articles";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function AdminArticleViewPage() {
  const { token } = useAuth();
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getArticle(articleId, token);
        setArticle(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [articleId, token]);

  return (
    <div>
      <h1>Voir article</h1>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {article ? (
        <div className="stack">
          <p>
            <strong>Titre:</strong> {article.title}
          </p>
          <p>
            <strong>Statut:</strong> {article.status}
          </p>
          <p>
            <strong>Contenu:</strong>
          </p>
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: article.content || "" }} />
          <p>
            <strong>Poissons liés:</strong>{" "}
            {article.fishes?.map((entry) => entry.fish?.name).filter(Boolean).join(", ") || "Aucun"}
          </p>
          <div className="row">
            <Link className="inline-link" to={`/admin/articles/${article.id}/edit`}>
              Modifier
            </Link>
            <Link className="inline-link" to="/admin/articles">
              Retour liste
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

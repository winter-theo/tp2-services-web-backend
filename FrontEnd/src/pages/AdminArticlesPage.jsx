import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteArticle, listArticles } from "../api/articles";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function AdminArticlesPage() {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listArticles({}, token);
        setArticles(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token]);

  const onDelete = async (articleId) => {
    const confirmed = window.confirm("Supprimer cet article ?");
    if (!confirmed) {
      return;
    }
    setError("");
    try {
      await deleteArticle(articleId, token);
      setArticles((prev) => prev.filter((article) => article.id !== articleId));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Admin - Articles</h1>
      <div className="row">
        <Link className="inline-link" to="/admin/articles/create">
          Créer un article
        </Link>
      </div>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      <ul className="simple-list">
        {articles.map((article) => (
          <li key={article.id} className="list-row">
            <span>
              <strong>{article.title}</strong> - {article.status}
            </span>
            <span className="row compact">
              <Link className="inline-link" to={`/admin/articles/${article.id}`}>
                voir
              </Link>
              <Link className="inline-link" to={`/admin/articles/${article.id}/edit`}>
                modifier
              </Link>
              <button type="button" className="text-button" onClick={() => onDelete(article.id)}>
                supprimer
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

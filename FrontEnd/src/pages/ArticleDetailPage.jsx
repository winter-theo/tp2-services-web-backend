import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticle } from "../api/articles";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function ArticleDetailPage() {
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
      <h1>Article</h1>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {article && article.status === "PUBLISHED" ? (
        <article className="sub-card">
          <h2>{article.title}</h2>
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: article.content || "" }} />
          <p className="hint">Poissons associés:</p>
          {article.fishes?.length ? (
            <ul className="inline-links-list">
              {article.fishes.map((entry) =>
                entry.fish ? (
                  <li key={`${article.id}-${entry.fish.id}`}>
                    <Link className="inline-link" to={`/fish/${entry.fish.id}`}>
                      {entry.fish.name}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          ) : (
            <p className="hint">Aucun</p>
          )}
        </article>
      ) : null}
      {article && article.status !== "PUBLISHED" ? <p>Article non disponible en accès public.</p> : null}
      <div className="row">
        <Link className="inline-link" to="/articles">
          Retour aux articles
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

const TEASER_LENGTH = 180;

const htmlToPlainText = (html) => {
  if (!html) {
    return "";
  }
  return html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const makeTeaser = (html, length = TEASER_LENGTH) => {
  const text = htmlToPlainText(html);
  if (text.length <= length) {
    return text;
  }
  return `${text.slice(0, length).trim()}...`;
};

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

  const relatedArticles = (fish?.articles || [])
    .map((entry) => entry.article)
    .filter((article) => article && article.status === "PUBLISHED");

  return (
    <div>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {fish ? (
        <article className="sub-card">
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: fish.description || "" }} />
          <div style={{ marginTop: "1.25rem" }}>
            <p className="hint">Articles qui en parlent:</p>
            {relatedArticles.length ? (
              <ul className="simple-list">
                {relatedArticles.map((article) => (
                  <li key={article.id} className="search-item">
                    <h2 className="search-title">{article.title}</h2>
                    <p className="hint">{makeTeaser(article.content)}</p>
                    <Link className="inline-link" to={`/articles/${article.id}`}>
                      Voir l&apos;article
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="hint">Aucun article publié lié.</p>
            )}
          </div>
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

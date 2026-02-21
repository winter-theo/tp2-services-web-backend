import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArticles } from "../api/articles";
import { listFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

const TEASER_LENGTH = 180;

const htmlToPlainText = (html) => {
  if (!html) {
    return "";
  }
  return html
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

export default function ArticlesPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    q: "",
    fishId: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    q: "",
    fishId: "",
  });
  const [articles, setArticles] = useState([]);
  const [fishOptions, setFishOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listArticles({ ...appliedFilters, status: "PUBLISHED" }, token);
        setArticles(Array.isArray(data) ? data : []);
        setPageIndex(0);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token, appliedFilters]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await listFish({}, token);
        setFishOptions(Array.isArray(data) ? data : []);
      } catch {
        setFishOptions([]);
      }
    };
    void run();
  }, [token]);

  const onSubmit = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const onReset = () => {
    const cleared = { q: "", fishId: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  const total = articles.length;
  const currentArticle = total > 0 ? articles[pageIndex] : null;
  const isSearchMode = appliedFilters.q.trim().length > 0;
  const goPrev = () => setPageIndex((prev) => Math.max(0, prev - 1));
  const goNext = () => setPageIndex((prev) => Math.min(total - 1, prev + 1));

  return (
    <div>
      <form className="filters" onSubmit={onSubmit}>
        <input
          className="articles-search-input"
          type="text"
          placeholder="Recherche (titre/contenu)"
          value={filters.q}
          onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
        />
        <select
          className="fish-filter-select"
          value={filters.fishId}
          onChange={(e) => setFilters((prev) => ({ ...prev, fishId: e.target.value }))}
        >
          <option value="">Tous poissons</option>
          {fishOptions.map((fish) => (
            <option key={fish.id} value={fish.id}>
              {fish.name}
            </option>
          ))}
        </select>
        <button type="submit">Rechercher</button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </form>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {!loading && total === 0 ? <p>Aucun article publié trouvé.</p> : null}
      {!loading && isSearchMode ? (
        <ul className="simple-list">
          {articles.map((article) => (
            <li key={article.id} className="search-item">
              <h2 className="search-title">{article.title}</h2>
              <p className="hint">{makeTeaser(article.content)}</p>
              <Link className="inline-link" to={`/articles/${article.id}`}>
                Voir l'article
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {!loading && !isSearchMode && currentArticle ? (
        <article className="sub-card">
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: currentArticle.content || "" }} />
          <p className="hint">Lié aux poissons:</p>
          {currentArticle.fishes?.length ? (
            <ul className="inline-links-list">
              {currentArticle.fishes.map((entry) =>
                entry.fish ? (
                  <li key={`${currentArticle.id}-${entry.fish.id}`}>
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
          <div className="row article-pagination">
            <button type="button" onClick={goPrev} disabled={pageIndex === 0}>
              {"<"}
            </button>
            <span className="hint">
              Article {pageIndex + 1} / {total}
            </span>
            <button type="button" onClick={goNext} disabled={pageIndex >= total - 1}>
              {">"}
            </button>
          </div>
        </article>
      ) : null}
    </div>
  );
}

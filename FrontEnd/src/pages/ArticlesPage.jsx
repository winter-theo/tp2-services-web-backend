import { useEffect, useState } from "react";
import { listArticles } from "../api/articles";
import { listFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function ArticlesPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    fishId: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    q: "",
    status: "",
    fishId: "",
  });
  const [articles, setArticles] = useState([]);
  const [fishOptions, setFishOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listArticles(appliedFilters, token);
        setArticles(Array.isArray(data) ? data : []);
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
    const cleared = { q: "", status: "", fishId: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  return (
    <div>
      <h1>Articles</h1>
      <form className="filters" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Recherche (titre/contenu)"
          value={filters.q}
          onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">Tous statuts</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="DRAFT">DRAFT</option>
        </select>
        <select
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
      <ul className="simple-list">
        {articles.map((article) => (
          <li key={article.id}>
            <strong>{article.title}</strong> - {article.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

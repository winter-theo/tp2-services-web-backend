import { useEffect, useState } from "react";
import { listFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

export default function FishPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({ q: "" });
  const [appliedFilters, setAppliedFilters] = useState({ q: "" });
  const [fish, setFish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listFish(appliedFilters, token);
        setFish(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token, appliedFilters]);

  const onSubmit = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const onReset = () => {
    const cleared = { q: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  return (
    <div>
      <h1>Fish</h1>
      <form className="filters" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Recherche par nom"
          value={filters.q}
          onChange={(e) => setFilters({ q: e.target.value })}
        />
        <button type="submit">Rechercher</button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </form>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      <ul className="simple-list">
        {fish.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: item.description || "" }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

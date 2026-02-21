import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listFish } from "../api/fish";
import ApiStatus from "../components/ApiStatus";
import { useAuth } from "../context/AuthContext";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function FishPage() {
  const { token } = useAuth();
  const [fish, setFish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listFish({}, token);
        setFish(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token]);

  const groupedFish = useMemo(() => {
    const groups = Object.fromEntries(ALPHABET.map((letter) => [letter, []]));

    for (const item of fish) {
      const firstLetter = (item.name || "").trim().charAt(0).toUpperCase();
      if (groups[firstLetter]) {
        groups[firstLetter].push(item);
      }
    }

    return groups;
  }, [fish]);

  return (
    <div>
      <ApiStatus error={error} />
      {loading ? <p>Chargement...</p> : null}
      {!loading ? (
        <>
          <nav className="alphabet-nav" aria-label="Index alphabétique des poissons">
            {ALPHABET.map((letter) =>
              groupedFish[letter].length > 0 ? (
                <a key={letter} href={`#letter-${letter}`}>
                  {letter}
                </a>
              ) : (
                <span key={letter} className="is-disabled">
                  {letter}
                </span>
              )
            )}
          </nav>

          <section className="fish-directory">
            {ALPHABET.map((letter) => {
              const items = groupedFish[letter];
              if (items.length === 0) {
                return (
                  <article key={letter} id={`letter-${letter}`} className="fish-group fish-group-empty">
                    <h2>{letter}</h2>
                  </article>
                );
              }

              return (
                <article key={letter} id={`letter-${letter}`} className="fish-group">
                  <h2>{letter}</h2>
                  <ul className="simple-list">
                    {items.map((item) => (
                      <li key={item.id} id={`fish-${item.id}`}>
                        <Link className="inline-link" to={`/fish/${item.id}`}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </section>
        </>
      ) : null}
    </div>
  );
}

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="page">
      <section className="card">
        <h1>404</h1>
        <p>Page introuvable.</p>
        <Link to="/articles">Retour articles</Link>
      </section>
    </main>
  );
}

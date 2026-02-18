import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin</h1>
      <p className="hint">Page accessible uniquement aux `ADMIN`.</p>
      <div className="row">
        <Link className="inline-link" to="/admin/users">
          Gérer les utilisateurs
        </Link>
        <Link className="inline-link" to="/admin/articles">
          Gérer les articles
        </Link>
        <Link className="inline-link" to="/admin/fish">
          Gérer les fiches poisson
        </Link>
      </div>
    </div>
  );
}

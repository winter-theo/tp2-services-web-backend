import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/articles", { replace: true });
  };

  return (
    <main className="page">
      <header className="shell-header">
        <Link to="/articles" className="brand">
          Aquarium BackOffice
        </Link>
        <div className="user-box">
          <span>
            {user?.email} ({user?.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="shell-nav">
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/fish">Fiches Poissons</NavLink>
        <NavLink to="/about">A Propos</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        {user?.role === "ADMIN" ? <NavLink to="/admin/users">Admin Users</NavLink> : null}
        {user?.role === "ADMIN" ? <NavLink to="/admin/articles">Admin Articles</NavLink> : null}
        {user?.role === "ADMIN" ? <NavLink to="/admin/fish">Admin Fish</NavLink> : null}
      </nav>

      <section className="card">
        <Outlet />
      </section>
    </main>
  );
}

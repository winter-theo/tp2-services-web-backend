import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <main className="page">
      <header className="shell-header">
        <Link to="/dashboard" className="brand">
          Aquarium BackOffice
        </Link>
        <div className="user-box">
          <span>
            {user?.email} ({user?.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="shell-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/fish">Fish</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        {user?.role === "ADMIN" ? <NavLink to="/admin">Admin</NavLink> : null}
        {user?.role === "ADMIN" ? <NavLink to="/admin/articles">Admin Articles</NavLink> : null}
        {user?.role === "ADMIN" ? <NavLink to="/admin/fish">Admin Fish</NavLink> : null}
      </nav>

      <section className="card">
        <Outlet />
      </section>
    </main>
  );
}

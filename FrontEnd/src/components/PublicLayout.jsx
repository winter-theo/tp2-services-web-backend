import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="page">
      <header className="shell-header">
        <p className="brand">Aquarium Public</p>
      </header>

      <nav className="shell-nav">
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/fish">Fish</NavLink>
        {isAuthenticated ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
        {!isAuthenticated ? <NavLink to="/login">Login</NavLink> : null}
        {!isAuthenticated ? <NavLink to="/register">Register</NavLink> : null}
      </nav>

      <section className="card">
        <Outlet />
      </section>
    </main>
  );
}

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/articles", { replace: true });
  };

  return (
    <main className="page">
      <header className="shell-header">
        <p className="brand">Aquarium Public</p>
        <div className="user-box">
          {isAuthenticated ? (
            <>
              <span>
                {user?.email} ({user?.role})
              </span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </header>

      <nav className="shell-nav">
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/fish">Fiches Poissons</NavLink>
        <NavLink to="/about">A Propos</NavLink>
        {isAuthenticated ? (
          <NavLink to="/messages">{user?.role === "ADMIN" ? "Admin Messages" : "Mes Messages"}</NavLink>
        ) : null}
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

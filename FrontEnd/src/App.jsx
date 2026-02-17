import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import AdminPage from "./pages/AdminPage";
import AdminArticleCreatePage from "./pages/AdminArticleCreatePage";
import AdminArticleEditPage from "./pages/AdminArticleEditPage";
import AdminArticlesPage from "./pages/AdminArticlesPage";
import AdminArticleViewPage from "./pages/AdminArticleViewPage";
import AdminFishCreatePage from "./pages/AdminFishCreatePage";
import AdminFishEditPage from "./pages/AdminFishEditPage";
import AdminFishPage from "./pages/AdminFishPage";
import AdminFishViewPage from "./pages/AdminFishViewPage";
import ArticlesPage from "./pages/ArticlesPage";
import DashboardPage from "./pages/DashboardPage";
import FishPage from "./pages/FishPage";
import LoginPage from "./pages/LoginPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <PublicLayout />
        }
      >
        <Route path="/" element={<Navigate to="/articles" replace />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/fish" element={<FishPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/article"
          element={<Navigate to="/admin/articles" replace />}
        />
        <Route
          path="/admin/articles"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles/create"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminArticleCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles/:articleId"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminArticleViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles/:articleId/edit"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminArticleEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/fishes" element={<Navigate to="/admin/fish" replace />} />
        <Route
          path="/admin/fish"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminFishPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fish/create"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminFishCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fish/:fishId"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminFishViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fish/:fishId/edit"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminFishEditPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

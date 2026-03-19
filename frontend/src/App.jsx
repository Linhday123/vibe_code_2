import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Readers from "./pages/Readers";
import BookTitles from "./pages/BookTitles";
import BookCopies from "./pages/BookCopies";
import Specializations from "./pages/Specializations";
import Borrows from "./pages/Borrows";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/readers"
        element={
          <PrivateRoute>
            <Readers />
          </PrivateRoute>
        }
      />
      <Route
        path="/specializations"
        element={
          <PrivateRoute>
            <Specializations />
          </PrivateRoute>
        }
      />
      <Route
        path="/book-titles"
        element={
          <PrivateRoute>
            <BookTitles />
          </PrivateRoute>
        }
      />
      <Route
        path="/book-copies"
        element={
          <PrivateRoute>
            <BookCopies />
          </PrivateRoute>
        }
      />
      <Route
        path="/borrows"
        element={
          <PrivateRoute>
            <Borrows />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute adminOnly>
            <Users />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AddDestination from "./pages/AddDestination";
import ViewDestination from "./pages/ViewDestination";
import EditDestination from "./pages/EditDestination";
import Profile from "./pages/Profile";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddDestination />
          </ProtectedRoute>
        }
      />
      <Route
        path="/destination/:id"
        element={
          <ProtectedRoute>
            <ViewDestination />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditDestination />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

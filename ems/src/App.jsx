import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PublicDirectory from "./pages/PublicDirectory";

// Protect dashboard route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Screen */}
        <Route path="/" element={<PublicDirectory />} />

        {/* Admin Login */}
        <Route path="/admin" element={<Login />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // {/* </ProtectedRoute> */}
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

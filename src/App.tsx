import {Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./context/ThemeContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (auth?.isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Checking Authentication...</div>; // Or a spinner
  }

  if (!auth?.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (auth?.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Or a spinner
  }

  if (auth?.isAuthenticated) {
      // Redirect logged-in users away from login/register (e.g., to dashboard)
      return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
    <ThemeProvider>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> {/* Add Profile route */}
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

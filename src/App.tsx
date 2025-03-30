import {Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import MenuPage from "./pages/MenuPage"

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token") // Si el token existe, está autenticado
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/accounts/login" />}
        />
        <Route path="/accounts/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/:restaurantName/carta" element={<MenuPage />} />
      </Routes>
    </Router>
  )
}

export default App

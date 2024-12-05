import React, { useContext } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { AuthContext, AuthProvider } from "contexts/AuthContext"
import { RestaurantProvider } from "contexts/RestaurantContext"
import { PreviewProvider } from "contexts/PreviewContext"
import Home from "pages/Home"
import Login from "pages/Login"
import Register from "pages/Register"
import Profile from "pages/Profile"
import MenuPage from "pages/MenuPage"

function App() {
  return (
    <Router>
      <AuthProvider>
        <RestaurantProvider>
          <PreviewProvider>
            <AppRoutes />
          </PreviewProvider>
        </RestaurantProvider>
      </AuthProvider>
    </Router>
  )
}

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route
        path="/home"
        element={isAuthenticated() ? <Home /> : <Navigate to="/accounts/login" />}
      />
      <Route path="/accounts/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/:restaurantName/carta" element={<MenuPage />} />
    </Routes>
  )
}

export default App

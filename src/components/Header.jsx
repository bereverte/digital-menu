import React, { useState, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const { restaurantData } = useContext(AuthContext)

  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("restaurantId")
    navigate("/accounts/login")
  }

  // Converteix el nom del restaurant a un format amigable per a la URL
  const getRestaurantUrlName = name => {
    return encodeURIComponent(name.replace(/\s+/g, "-").toLowerCase())
  }

  return (
    <header className="header">
      <p>Restaurant Dashboard</p>
      <button className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>
      <nav className={`header-nav ${isMobileMenuOpen ? "open" : ""}`}>
        <a href="/home">Home</a>
        <a onClick={() => navigate(`/${getRestaurantUrlName(restaurantData.name)}/carta`)}>
          Preview
        </a>
        <a onClick={() => navigate("/profile")}>Profile</a>
        <a onClick={handleLogout}>Logout</a>
      </nav>
    </header>
  )
}

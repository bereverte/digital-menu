import React, { useState, useContext } from "react"
import { AuthContext } from "contexts/AuthContext"
import { PreviewContext } from "contexts/PreviewContext"
import { useNavigate } from "react-router-dom"
import { getRestaurantUrlName } from "utils"

export default function Header() {
  const { restaurantData } = useContext(AuthContext)
  const { setIsPreviewMode } = useContext(PreviewContext)
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("restaurantId")
    navigate("/accounts/login")
  }

  const handlePreview = () => {
    setIsPreviewMode(true)
    navigate(`/${getRestaurantUrlName(restaurantData.name)}/carta`)
  }

  return (
    <header className="header">
      <p>Restaurant Dashboard</p>
      <button className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>
      <nav className={`header-nav ${isMobileMenuOpen ? "open" : ""}`}>
        <a onClick={() => navigate("/home")}>Home</a>
        <a onClick={handlePreview}>Preview</a>
        <a onClick={() => navigate("/profile")}>Profile</a>
        <a onClick={handleLogout}>Logout</a>
      </nav>
    </header>
  )
}

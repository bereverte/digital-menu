import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import apiMethods from "../api"

export default function Header() {
  const restaurantId = localStorage.getItem("restaurantId")
  const restaurantName = localStorage.getItem("restaurantName")

  const navigate = useNavigate()

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
      <nav className="header-nav">
        <a href="/home">Home</a>
        <a onClick={() => navigate(`/${getRestaurantUrlName(restaurantName)}/carta`)}>Preview</a>
        <a onClick={() => navigate("/profile")}>Profile</a>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  )
}

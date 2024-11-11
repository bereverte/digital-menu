import React, { useState, useEffect } from "react"
import MenuContent from "../components/MenuContent"
import ContactInfo from "../components/ContactInfo"
import { FaUtensils, FaPhone } from "react-icons/fa"
import "../styles/MenuPage.scss"
import apiMethods from "../api"

export default function MenuPage() {
  const restaurantName = localStorage.getItem("restaurantName")
  const [selectedTab, setSelectedTab] = useState("menu")
  const restaurantId = localStorage.getItem("restaurantId")
  const [restaurantInfo, setRestaurantInfo] = useState(null)

  useEffect(() => {
    apiMethods
      .fetchRestaurant(restaurantId)
      .then(response => {
        console.log("Restaurant Info:", response.data)
        setRestaurantInfo(response.data)
      })
      .catch(error => console.error("Error fetching restaurant info:", error))
  }, [restaurantId])

  const hasContactInfo = restaurantInfo?.address || restaurantInfo?.phone || restaurantInfo?.hours

  return (
    <div className="menu-page">
      <h1>{restaurantName}</h1>
      {selectedTab === "menu" ? <MenuContent /> : <ContactInfo />}

      {hasContactInfo && (
        <div className="footer-icons">
          <FaUtensils
            className={`icon ${selectedTab === "menu" ? "active" : ""}`}
            onClick={() => setSelectedTab("menu")}
          />
          <FaPhone
            className={`icon ${selectedTab === "contact" ? "active" : ""}`}
            onClick={() => setSelectedTab("contact")}
          />
        </div>
      )}
    </div>
  )
}

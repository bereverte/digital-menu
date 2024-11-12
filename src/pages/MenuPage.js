import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import MenuContent from "../components/MenuContent"
import ContactInfo from "../components/ContactInfo"
import { FaUtensils, FaPhone } from "react-icons/fa"
import "../styles/MenuPage.scss"

export default function MenuPage() {
  const { restaurantData, restaurantId, updateRestaurantData } = useContext(AuthContext)

  const [selectedTab, setSelectedTab] = useState("menu")

  useEffect(() => {
    // Si `restaurantData` ja està carregat al context, no cal fer cap altra crida
    if (!restaurantData && restaurantId) {
      updateRestaurantData()
    }
  }, [restaurantData, restaurantId, updateRestaurantData])

  const hasContactInfo = restaurantData?.address || restaurantData?.phone || restaurantData?.hours

  return (
    <div className="menu-page">
      <h1>{restaurantData?.name}</h1>
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

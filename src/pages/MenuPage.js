import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "contexts/AuthContext"
import { PreviewContext } from "contexts/PreviewContext"
import MenuContent from "components/MenuContent"
import ContactInfo from "components/ContactInfo"
import { FaUtensils, FaPhone } from "react-icons/fa"
import "styles/MenuPage.scss"
import { useNavigate } from "react-router-dom"
import backArrow from "assets/icons/arrow-left-circle.svg"

export default function MenuPage() {
  const { restaurantData, restaurantId, updateRestaurantData } = useContext(AuthContext)
  const { isPreviewMode, setIsPreviewMode } = useContext(PreviewContext)
  const navigate = useNavigate()

  const [selectedTab, setSelectedTab] = useState("menu")

  const handleBack = () => {
    setIsPreviewMode(false)
    navigate("/home")
  }

  useEffect(() => {
    // Si `restaurantData` ja està carregat al context, no cal fer cap altra crida
    if (!restaurantData && restaurantId) {
      updateRestaurantData()
    }
  }, [restaurantData, restaurantId, updateRestaurantData])

  const hasContactInfo = restaurantData?.address || restaurantData?.phone || restaurantData?.hours

  console.log("isPreviewMode:", isPreviewMode)

  return (
    <div className="menu-page">
      {isPreviewMode && (
        <img
          src={backArrow}
          alt="Back arrow icon"
          className="back-arrow icon"
          onClick={handleBack}
        />
      )}

      <h1>{restaurantData?.name}</h1>
      {selectedTab === "menu" ? <MenuContent /> : <ContactInfo />}

      {hasContactInfo && (
        <div className="footer-icons">
          <FaUtensils
            role="button"
            aria-label="menu"
            className={`icon ${selectedTab === "menu" ? "active" : ""}`}
            onClick={() => setSelectedTab("menu")}
          />
          <FaPhone
            role="button"
            aria-label="phone"
            className={`icon ${selectedTab === "contact" ? "active" : ""}`}
            onClick={() => setSelectedTab("contact")}
          />
        </div>
      )}
    </div>
  )
}

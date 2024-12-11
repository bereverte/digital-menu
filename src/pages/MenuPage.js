import React, { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { PreviewContext } from "contexts/PreviewContext"
import MenuContent from "components/MenuContent"
import ContactInfo from "components/ContactInfo"
import { FaUtensils, FaPhone } from "react-icons/fa"
import "styles/MenuPage.scss"
import { useNavigate } from "react-router-dom"
import backArrow from "assets/icons/arrow-left-circle.svg"
import apiMethods from "api"

export default function MenuPage() {
  const { restaurantId } = useParams()
  const [restaurantData, setRestaurantData] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedTab, setSelectedTab] = useState("menu")

  const { isPreviewMode, setIsPreviewMode } = useContext(PreviewContext)
  const navigate = useNavigate()

  const handleBack = () => {
    setIsPreviewMode(false)
    navigate("/home")
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carrega dades del restaurant, categories i ítems
        const [restaurantRes, categoriesRes, menuItemsRes] = await Promise.all([
          apiMethods.fetchRestaurant(restaurantId, true),
          apiMethods.fetchCategories(restaurantId, true),
          apiMethods.fetchMenuItems(restaurantId, true),
        ])
        setRestaurantData(restaurantRes.data)
        setCategories(categoriesRes.data)
        setMenuItems(menuItemsRes.data)
      } catch (error) {
        console.error("Error loading restaurant data:", error)
      }
    }

    fetchData()
  }, [restaurantId])

  const hasContactInfo = restaurantData?.address || restaurantData?.phone || restaurantData?.hours

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
      {selectedTab === "menu" ? (
        <MenuContent categories={categories} menuItems={menuItems} />
      ) : (
        <ContactInfo restaurantData={restaurantData} />
      )}

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

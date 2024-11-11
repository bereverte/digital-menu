import React, { createContext, useState, useEffect } from "react"
import apiMethods from "../api"

export const RestaurantContext = createContext()

export const RestaurantProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const restaurantId = localStorage.getItem("restaurantId")

  useEffect(() => {
    if (restaurantId) {
      apiMethods
        .fetchCategories(restaurantId)
        .then(response => {
          setCategories(response.data)
        })
        .catch(error => {
          console.error("Error fetching categories:", error)
        })

      apiMethods
        .fetchMenuItems(restaurantId)
        .then(response => {
          setMenuItems(response.data)
        })
        .catch(error => {
          console.error("Error fetching menu items:", error)
        })
    }
  }, [restaurantId])

  return (
    <RestaurantContext.Provider value={{ categories, menuItems, setCategories, setMenuItems }}>
      {children}
    </RestaurantContext.Provider>
  )
}

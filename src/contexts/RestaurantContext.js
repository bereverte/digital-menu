import React, { createContext, useState, useEffect } from "react"
import apiMethods from "api"

export const RestaurantContext = createContext()

export const RestaurantProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const restaurantId = localStorage.getItem("restaurantId")

  useEffect(() => {
    if (!restaurantId) {
      setCategories([])
      setMenuItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

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
      .finally(() => {
        setLoading(false)
      })
  }, [restaurantId])

  return (
    <RestaurantContext.Provider value={{ categories, menuItems, setCategories, setMenuItems }}>
      {children}
    </RestaurantContext.Provider>
  )
}

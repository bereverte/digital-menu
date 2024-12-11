import React, { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import apiMethods from "api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || null) // Inicialitza restaurantId des de localStorage
  const [restaurantData, setRestaurantData] = useState(null)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && restaurantId && !userData && !restaurantData) {
        try {
          const restaurantResponse = await apiMethods.fetchRestaurant(restaurantId)
          setRestaurantData(restaurantResponse.data)

          const userResponse = await apiMethods.fetchAuthenticatedUser(restaurantId)
          setUserData(userResponse.data)
        } catch (error) {
          console.error("Error fetching data:", error)
          logout()
        }
      }
    }

    fetchUserData()
  }, [token, restaurantId])

  const login = async (email, password) => {
    try {
      const response = await apiMethods.login(email, password)
      const { token, restaurant_id } = response.data

      setToken(token)
      localStorage.setItem("token", token)

      setRestaurantId(restaurant_id)
      localStorage.setItem("restaurantId", restaurant_id)

      const restaurantResponse = await apiMethods.fetchRestaurant(restaurant_id)
      setRestaurantData(restaurantResponse.data)

      const userResponse = await apiMethods.fetchAuthenticatedUser(restaurant_id)
      setUserData(userResponse.data)

      navigate("/home")
    } catch (error) {
      console.error("Error during login:", error)
      logout() // Limpiar el estado en caso de error
      throw new Error("Login failed. Please check your credentials.")
    }
  }

  const logout = () => {
    setToken(null)
    setRestaurantData(null)
    setRestaurantId(null)
    setUserData(null)
    localStorage.clear()
    navigate("/accounts/login")
  }

  const updateRestaurantData = async updatedData => {
    try {
      await apiMethods.updateRestaurant(restaurantId, updatedData)

      const restaurantResponse = await apiMethods.fetchRestaurant(restaurantId)
      setRestaurantData(restaurantResponse.data)
    } catch (error) {
      console.error("Error updating restaurant data:", error)
      throw new Error("Failed to update restaurant data")
    }
  }

  const isAuthenticated = () => !!token

  return (
    <AuthContext.Provider
      value={{
        token,
        restaurantId,
        restaurantData,
        userData,
        login,
        logout,
        updateRestaurantData,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

import React, { useEffect, useState } from "react"
import apiMethods from "../api"

export default function ContactInfo() {
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

  return (
    <>
      <h2>Contact Information</h2>
      {restaurantInfo && (
        <div>
          <p>
            <strong>Address:</strong> {restaurantInfo.address || "Not available"}
          </p>
          <p>
            <strong>Phone:</strong> {restaurantInfo.phone || "Not available"}
          </p>
          <p>
            <strong>Hours:</strong> {restaurantInfo.hours || "Not available"}
          </p>
        </div>
      )}
    </>
  )
}

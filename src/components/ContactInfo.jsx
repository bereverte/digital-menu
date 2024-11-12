import React, { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

export default function ContactInfo() {
  const { restaurantData } = useContext(AuthContext)

  return (
    <div className="contact-content">
      <h2>Contact Information</h2>
      {restaurantData && (
        <div>
          {restaurantData.address && (
            <p>
              <strong>Address:</strong> {restaurantData.address}
            </p>
          )}
          {restaurantData.phone && (
            <p>
              <strong>Phone:</strong> {restaurantData.phone}
            </p>
          )}
          {restaurantData.hours && (
            <p>
              <strong>Hours:</strong> {restaurantData.hours}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

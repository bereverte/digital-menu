import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

const getRestaurantUrlName = name => {
  return encodeURIComponent(name.replace(/\s+/g, "-").toLowerCase())
}

export default function QRPreviewLink() {
  const { restaurantData } = useContext(AuthContext)

  const previewUrl = `http://localhost:3000/${getRestaurantUrlName(restaurantData.name)}/carta`

  return (
    <div className="qr-container">
      <div className="profile-qr-header">QR Code to Preview</div>
      <div className="qr-content">
        <QRCodeSVG value={previewUrl} size={150} />
        <p className="restaurantName-qr">{restaurantData.name}</p>
      </div>
      <p>Scan the QR code to preview the page!</p>
    </div>
  )
}

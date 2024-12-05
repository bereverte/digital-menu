import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { useContext } from "react"
import { AuthContext } from "contexts/AuthContext"
import { getRestaurantUrlName } from "utils"

export default function QRCodePanel() {
  const { restaurantData } = useContext(AuthContext)
  const previewUrl = `https://digitalmenu-khaki.vercel.app/${getRestaurantUrlName(
    restaurantData.name
  )}/carta`

  return (
    <div className="qr-container">
      <div className="profile-qr-header">QR Code to Preview</div>
      <div className="qr-content">
        {console.log("QRCodeSVG rendering with value:", previewUrl)}
        <QRCodeSVG value={previewUrl} size={150} data-testid="qr-code" />
        <p className="restaurantName-qr">{restaurantData.name}</p>
      </div>
      <p>Scan the QR code to preview the page!</p>
    </div>
  )
}

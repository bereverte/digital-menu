import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { useContext } from "react"
import { AuthContext } from "contexts/AuthContext"

export default function QRCodePanel() {
  const { restaurantData, restaurantId } = useContext(AuthContext)
  const baseUrl = "https://digitalmenu-khaki.vercel.app" // URL base de producció

  if (!restaurantId || !restaurantData) {
    return (
      <div className="qr-container">
        <div className="profile-qr-header">QR Code to Preview</div>
        <div>Loading...</div>
      </div>
    )
  }

  const previewUrl = `${baseUrl}/menu/${restaurantId}`

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

/* import React, { useEffect, useState } from "react"
import QRCode from "qrcode.react"

export default function QRCodePanel() {
  const restaurantName = localStorage.getItem("restaurantName")
  const [qrUrl, setQrUrl] = useState("")

  useEffect(() => {
    if (restaurantName) {
      setQrUrl(`${window.location.origin}/${restaurantName}/carta`) // URL única per al QR
    }
  }, [restaurantName])

  return (
    <div className="profile-container">
      <div className="profile-header">QR per a la carta</div>
      <div className="profile-content">
        <p>Escaneja el codi QR per accedir a la carta del restaurant:</p>
        <div className="qr-container">
          {qrUrl ? <QRCode value={qrUrl} size={200} level={"H"} /> : <p>Generant el QR...</p>}
        </div>
        <div className="profile-field">
          <label>URL de la carta:</label>
          <input type="text" readOnly value={qrUrl} />
        </div>
      </div>
    </div>
  )
}
 */

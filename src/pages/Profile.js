import React from "react"
import Header from "../components/Header"
import ProfilePanel from "../components/ProfilePanel"
import QRCodePanel from "../components/QRCodePanel"
import "../styles/Profile.scss"

export default function Profile() {
  return (
    <div className="home">
      <Header />
      <div className="profile-qr-container">
        <ProfilePanel />
        <QRCodePanel />
      </div>
    </div>
  )
}

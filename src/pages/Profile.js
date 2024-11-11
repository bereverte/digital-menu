import React from "react"
import Header from "../components/Header"
import ProfilePanel from "../components/ProfilePanel"
import QRCodePanel from "../components/QRCodePanel"

export default function Profile() {
  return (
    <div className="home">
      <Header />
      <ProfilePanel />
    </div>
  )
}

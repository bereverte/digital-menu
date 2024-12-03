import React, { useState, useEffect } from "react"
import "styles/Home.scss"
import Header from "components/Header"
import MenuManagement from "components/MenuManagement"
import DetailsPanel from "components/DetailsPanel"

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const restaurantId = localStorage.getItem("restaurantId")

  const toggleForm = (section, openForm = false) => {
    if (section) {
      setSelectedSection(section)
    }
    setShowForm(openForm)
  }

  useEffect(() => {
    if (!showForm) {
      setShowForm(false)
    }
  }, [selectedSection])

  return (
    <div className="home">
      <Header />

      <div className="dashboard-container">
        <MenuManagement toggleForm={toggleForm} />
        {selectedSection && (
          <DetailsPanel
            selectedSection={selectedSection}
            restaurantId={restaurantId}
            showForm={showForm}
            toggleForm={toggleForm}
          />
        )}
      </div>
    </div>
  )
}

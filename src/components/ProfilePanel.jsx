import React, { useState, useEffect } from "react"
import apiMethods from "../api"
import imageProfileDefault from "../assets/logo_default.png"
import { useNavigate } from "react-router-dom"

export default function ProfilePanel() {
  const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName"))
  const restaurantId = localStorage.getItem("restaurantId")
  const email = localStorage.getItem("email")

  const [profilePhoto, setProfilePhoto] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()

  const handleCancel = () => {
    navigate("/home")
  }

  useEffect(() => {
    if (restaurantId) {
      apiMethods
        .fetchRestaurant(restaurantId)
        .then(response => {
          setProfilePhoto(response.data.logo || imageProfileDefault)
        })
        .catch(error => {
          console.error("Error fetching restaurant:", error)
        })
    }
  }, [restaurantId])

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData()
      if (restaurantName) formData.append("name", restaurantName)
      if (selectedFile) formData.append("logo", selectedFile)

      await apiMethods.updateRestaurant(restaurantId, formData)

      // Actualitzar el localStorage després de guardar els canvis
      localStorage.setItem("restaurantName", restaurantName)
      alert("Changes saved successfully!")
      navigate("/home")
    } catch (error) {
      console.error("Error saving changes:", error.response ? error.response.data : error)
      alert("Failed to save changes.")
    }
  }

  const handleNameChange = e => {
    setRestaurantName(e.target.value)
  }

  const handlePhotoChange = e => {
    const file = e.target.files[0]
    if (file) {
      // Previsualitzar la imatge seleccionada de manera ràpida
      const previewUrl = URL.createObjectURL(file)
      setProfilePhoto(previewUrl)
      // Guardar el fitxer original en un estat separat per a enviar-lo després
      setSelectedFile(file)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">Personal Info</div>
      <div className="profile-content">
        <div className="profile-photo-container">
          <img src={profilePhoto} alt="Foto de perfil" className="profile-photo" />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="photo-input"
          />
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <label htmlFor="restaurant-name">Restaurant name:</label>
            <input
              type="text"
              id="restaurant-name"
              name="restaurantName"
              value={restaurantName}
              onChange={handleNameChange}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="email">Email address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              autoComplete="email"
              readOnly
            />
          </div>
        </div>
        <div className="profile-buttons">
          <button type="button" onClick={handleSaveChanges}>
            Save changes
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

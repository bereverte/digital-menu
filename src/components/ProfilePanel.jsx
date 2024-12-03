import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "contexts/AuthContext"
import apiMethods from "api"
import imageProfileDefault from "assets/logo_default.png"
import { useNavigate } from "react-router-dom"

export default function ProfilePanel() {
  const { restaurantData, restaurantId, updateRestaurantData, userData } = useContext(AuthContext)
  const navigate = useNavigate()

  console.log("Restaurant Data:", restaurantData)
  console.log("User Data:", userData)

  console.log("Logo:", restaurantData.logo)
  console.log("Ja esta")

  const email = userData?.email

  // Inicialització amb valors buits per evitar advertències
  const [restaurantName, setRestaurantName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [hours, setHours] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(imageProfileDefault) // Per defecte, la imatge per defecte
  const [selectedFile, setSelectedFile] = useState(null)

  const handleCancel = () => {
    navigate("/home")
  }

  // Sincronitza els estats locals amb restaurantData quan es carrega
  useEffect(() => {
    if (restaurantData) {
      console.log("Dades actualitzades de restaurantData:", restaurantData)
      console.log("URL de logo a restaurantData:", restaurantData.logo)

      setRestaurantName(restaurantData.name || "")
      setAddress(restaurantData.address || "")
      setPhone(restaurantData.phone || "")
      setHours(restaurantData.hours || "")

      // Assegura't que `profilePhoto` s'assigna correctament
      setProfilePhoto(restaurantData.logo ? restaurantData.logo : imageProfileDefault)
    }
  }, [restaurantData])

  const handleSaveChanges = async () => {
    if (!restaurantId) {
      console.error("Restaurant ID is undefined")
      alert("Restaurant ID is missing. Please try again.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", restaurantName)
      formData.append("address", address)
      formData.append("phone", phone)
      formData.append("hours", hours)
      if (selectedFile) formData.append("logo", selectedFile)
      console.log("Restaurant ID del save:", restaurantId)

      await apiMethods.updateRestaurant(restaurantId, formData)
      await updateRestaurantData()

      alert("Changes saved successfully!")
      navigate("/home")
    } catch (error) {
      console.error("Error saving changes:", error.response ? error.response.data : error)
      alert("Failed to save changes.")
    }
  }

  const handlePhotoChange = e => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setProfilePhoto(previewUrl)
      setSelectedFile(file)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-qr-header">Personal Info</div>
      <div className="profile-content">
        <div className="profile-photo-container">
          <img src={profilePhoto} alt="Foto de perfil" className="profile-photo" />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="photo-input"
            aria-label="Upload profile photo"
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
              onChange={e => setRestaurantName(e.target.value)}
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
          <div className="profile-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="hours">Hours:</label>
            <input
              type="text"
              id="hours"
              name="hours"
              value={hours}
              onChange={e => setHours(e.target.value)}
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

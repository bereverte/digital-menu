import React from "react"
import { render, screen } from "@testing-library/react"
import { AuthContext } from "contexts/AuthContext"
import ContactInfo from "components/ContactInfo"

test("renders contact information", () => {
  const mockRestaurantData = {
    address: "123 Main St",
    phone: "123-456-7890",
    hours: "9:00 AM - 10:00 PM",
  }

  render(
    <AuthContext.Provider value={{ restaurantData: mockRestaurantData }}>
      <ContactInfo />
    </AuthContext.Provider>
  )

  expect(screen.getByText("Address:")).toBeInTheDocument()
  expect(screen.getByText("123 Main St")).toBeInTheDocument()
  expect(screen.getByText("Phone:")).toBeInTheDocument()
  expect(screen.getByText("123-456-7890")).toBeInTheDocument()
  expect(screen.getByText("Hours:")).toBeInTheDocument()
  expect(screen.getByText("9:00 AM - 10:00 PM")).toBeInTheDocument()
})

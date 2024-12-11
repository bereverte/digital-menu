import React from "react"
import { render, screen } from "@testing-library/react"
import ContactInfo from "components/ContactInfo"

describe("ContactInfo component", () => {
  const mockRestaurantData = {
    address: "123 Main St",
    phone: "123-456-7890",
    hours: "9:00 AM - 10:00 PM",
  }

  test("renders all contact information when data is available", () => {
    render(<ContactInfo restaurantData={mockRestaurantData} />)

    expect(screen.getByText("Contact Information")).toBeInTheDocument()
    expect(screen.getByText("Address:")).toBeInTheDocument()
    expect(screen.getByText("123 Main St")).toBeInTheDocument()
    expect(screen.getByText("Phone:")).toBeInTheDocument()
    expect(screen.getByText("123-456-7890")).toBeInTheDocument()
    expect(screen.getByText("Hours:")).toBeInTheDocument()
    expect(screen.getByText("9:00 AM - 10:00 PM")).toBeInTheDocument()
  })

  test("does not render empty fields when data is missing", () => {
    const partialData = { address: "123 Main St" }
    render(<ContactInfo restaurantData={partialData} />)

    expect(screen.getByText("Address:")).toBeInTheDocument()
    expect(screen.getByText("123 Main St")).toBeInTheDocument()
    expect(screen.queryByText("Phone:")).not.toBeInTheDocument()
    expect(screen.queryByText("Hours:")).not.toBeInTheDocument()
  })
})

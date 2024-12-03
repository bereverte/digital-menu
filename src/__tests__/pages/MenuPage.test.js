import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { AuthContext } from "contexts/AuthContext"
import MenuPage from "pages/MenuPage"

jest.mock("components/MenuContent", () => () => <div>Menu Content</div>)
jest.mock("components/ContactInfo", () => () => <div>Contact Info</div>)

describe("MenuPage", () => {
  const mockUpdateRestaurantData = jest.fn()

  const renderMenuPage = contextValue =>
    render(
      <AuthContext.Provider value={contextValue}>
        <MenuPage />
      </AuthContext.Provider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders restaurant name and menu tab by default", () => {
    renderMenuPage({
      restaurantData: {
        name: "Test Restaurant",
        address: "123 Main Street, Test City",
        phone: "123-456-7890",
        hours: "9:00 AM - 10:00 PM",
      },
      restaurantId: "123",
      updateRestaurantData: mockUpdateRestaurantData,
    })

    screen.debug()

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument()
    expect(screen.getByText("Menu Content")).toBeInTheDocument()
  })

  test("renders footer icons when contact info is available", () => {
    renderMenuPage({
      restaurantData: { name: "Test Restaurant", address: "123 Main Street" },
      restaurantId: "123",
      updateRestaurantData: mockUpdateRestaurantData,
    })

    screen.debug()

    expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /phone/i })).toBeInTheDocument()
  })

  test("does not render footer icons when contact info is unavailable", () => {
    renderMenuPage({
      restaurantData: { name: "Test Restaurant" },
      restaurantId: "123",
      updateRestaurantData: mockUpdateRestaurantData,
    })

    expect(screen.queryByRole("button", { name: /menu/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /phone/i })).not.toBeInTheDocument()
  })

  test("switches to contact info tab when phone icon is clicked", () => {
    renderMenuPage({
      restaurantData: { name: "Test Restaurant", address: "123 Main Street" },
      restaurantId: "123",
      updateRestaurantData: mockUpdateRestaurantData,
    })

    // Simula el clic al botó del telèfon
    fireEvent.click(screen.getByRole("button", { name: /phone/i }))

    // Verifica que es mostra el component ContactInfo
    expect(screen.getByText("Contact Info")).toBeInTheDocument()
    expect(screen.queryByText("Menu Content")).not.toBeInTheDocument()
  })

  test("switches back to menu tab when utensils icon is clicked", () => {
    renderMenuPage({
      restaurantData: { name: "Test Restaurant", address: "123 Main Street" },
      restaurantId: "123",
      updateRestaurantData: mockUpdateRestaurantData,
    })

    // Canvia a ContactInfo
    fireEvent.click(screen.getByRole("button", { name: /phone/i }))
    expect(screen.getByText("Contact Info")).toBeInTheDocument()

    // Torna a MenuContent
    fireEvent.click(screen.getByRole("button", { name: /menu/i }))
    expect(screen.getByText("Menu Content")).toBeInTheDocument()
  })
})

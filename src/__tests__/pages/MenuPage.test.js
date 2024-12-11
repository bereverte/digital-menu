import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { PreviewContext } from "contexts/PreviewContext"
import MenuPage from "pages/MenuPage"
import apiMethods from "api"

jest.mock("api", () => ({
  fetchRestaurant: jest.fn(),
  fetchCategories: jest.fn(),
  fetchMenuItems: jest.fn(),
}))

jest.mock("components/MenuContent", () => () => <div>Menu Content</div>)
jest.mock("components/ContactInfo", () => () => <div>Contact Info</div>)

// Mock de `useNavigate`
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ restaurantId: "123" }), // Simula `restaurantId`
}))

describe("MenuPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderMenuPage = (restaurantData, previewMode = false) => {
    apiMethods.fetchRestaurant.mockResolvedValue({ data: restaurantData })
    apiMethods.fetchCategories.mockResolvedValue({ data: [] })
    apiMethods.fetchMenuItems.mockResolvedValue({ data: [] })

    render(
      <PreviewContext.Provider value={{ isPreviewMode: previewMode, setIsPreviewMode: jest.fn() }}>
        <MenuPage />
      </PreviewContext.Provider>
    )
  }

  test("renders menu tab by default", async () => {
    renderMenuPage()

    expect(await screen.findByText("Menu Content")).toBeInTheDocument()
    expect(screen.queryByText("Contact Info")).not.toBeInTheDocument()
  })

  test("renders the back arrow only in preview mode", () => {
    const restaurantData = {
      id: 123,
      name: "Test Restaurant",
      address: "123 Main Street",
      phone: "123-456-7890",
      hours: "9:00 AM - 10:00 PM",
    }

    renderMenuPage(restaurantData, true)
    expect(screen.getByAltText("Back arrow icon")).toBeInTheDocument()

    cleanup()

    renderMenuPage(restaurantData, false) // isPreviewMode = false
    expect(screen.queryByAltText("Back arrow icon")).not.toBeInTheDocument()
  })

  test("renders footer icons if contact info is available", async () => {
    const restaurantData = {
      id: 123,
      name: "Test Restaurant",
      address: "123 Main Street",
      phone: "123-456-7890",
      hours: "9:00 AM - 10:00 PM",
    }

    renderMenuPage(restaurantData)

    // Simula que existeix informació de contacte
    expect(await screen.findByRole("button", { name: /menu/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /phone/i })).toBeInTheDocument()
  })

  test("does not render footer icons if contact info is unavailable", async () => {
    const restaurantData = {
      id: 123,
      name: "Test Restaurant",
    }

    renderMenuPage(restaurantData)

    // Simula que no existeix informació de contacte
    expect(await screen.queryByRole("button", { name: /menu/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /phone/i })).not.toBeInTheDocument()
  })

  test("switches to ContactInfo when phone icon is clicked", async () => {
    const restaurantData = {
      id: 123,
      name: "Test Restaurant",
      address: "123 Main Street",
      phone: "123-456-7890",
      hours: "9:00 AM - 10:00 PM",
    }

    renderMenuPage(restaurantData)

    expect(await screen.findByRole("button", { name: /phone/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /phone/i }))

    // Verifica que es mostra Contact Info
    expect(await screen.findByText("Contact Info")).toBeInTheDocument()
    expect(screen.queryByText("Menu Content")).not.toBeInTheDocument()
  })
})

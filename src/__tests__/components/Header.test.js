import { render, screen, fireEvent } from "@testing-library/react"
import Header from "components/Header"
import { BrowserRouter } from "react-router-dom"
import { AuthContext } from "contexts/AuthContext"
import { PreviewContext } from "contexts/PreviewContext"

jest.mock("axios")

// Mock de `useNavigate`
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("Header component", () => {
  const mockRestaurantData = { name: "Test Restaurant" }

  const renderHeader = () =>
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            restaurantData: mockRestaurantData,
            restaurantId: 1,
          }}
        >
          <PreviewContext.Provider value={{ setIsPreviewMode: jest.fn() }}>
            <Header />
          </PreviewContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    )

  test("renders Header with title and menu items", () => {
    renderHeader()

    expect(screen.getByText("Restaurant Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Preview")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  test("toggles mobile menu", () => {
    renderHeader()

    const hamburgerMenu = screen.getByRole("button", { name: "☰" })
    const nav = screen.getByRole("navigation")

    // Comprova que el menú està tancat inicialment
    expect(nav).not.toHaveClass("open")

    // Simula clic per obrir el menú
    fireEvent.click(hamburgerMenu)
    expect(nav).toHaveClass("open")

    // Simula clic per tancar el menú
    fireEvent.click(hamburgerMenu)
    expect(nav).not.toHaveClass("open")
  })

  test("navigates to correct pages", () => {
    renderHeader()

    fireEvent.click(screen.getByText("Home"))
    expect(mockNavigate).toHaveBeenCalledWith("/home")

    fireEvent.click(screen.getByText("Preview"))
    expect(mockNavigate).toHaveBeenCalledWith("/menu/1")

    fireEvent.click(screen.getByText("Profile"))
    expect(mockNavigate).toHaveBeenCalledWith("/profile")
  })

  test("handles logout correctly", () => {
    // Mock de `localStorage`
    Storage.prototype.removeItem = jest.fn()

    renderHeader()

    fireEvent.click(screen.getByText("Logout"))

    // Comprova que els valors de localStorage s'esborren
    expect(localStorage.removeItem).toHaveBeenCalledWith("token")
    expect(localStorage.removeItem).toHaveBeenCalledWith("restaurantId")

    // Comprova que redirigeix a la pàgina de login
    expect(mockNavigate).toHaveBeenCalledWith("/accounts/login")
  })

  test("generates correct restaurant URL for Preview link", () => {
    renderHeader()

    const previewLink = screen.getByText("Preview")
    fireEvent.click(previewLink)
    expect(mockNavigate).toHaveBeenCalledWith("/menu/1")
  })
})

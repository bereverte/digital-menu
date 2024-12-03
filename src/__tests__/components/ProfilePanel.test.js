import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ProfilePanel from "components/ProfilePanel"
import { AuthContext } from "contexts/AuthContext"
import apiMethods from "api"
import { BrowserRouter } from "react-router-dom"

jest.mock("api", () => ({
  updateRestaurant: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("ProfilePanel component", () => {
  const mockUpdateRestaurantData = jest.fn()
  const mockRestaurantData = {
    name: "Test Restaurant",
    address: "Test Address",
    phone: "123456789",
    hours: "9am - 9pm",
    logo: null,
  }
  const mockUserData = {
    email: "test@example.com",
  }

  const renderProfilePanel = () => {
    render(
      <AuthContext.Provider
        value={{
          restaurantData: mockRestaurantData,
          restaurantId: 1,
          updateRestaurantData: mockUpdateRestaurantData,
          userData: mockUserData,
        }}
      >
        <BrowserRouter>
          <ProfilePanel />
        </BrowserRouter>
      </AuthContext.Provider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    URL.createObjectURL = jest.fn(() => "mocked-url")
  })

  test("renders all fields and buttons", () => {
    renderProfilePanel()

    expect(screen.getByText("Personal Info")).toBeInTheDocument()
    expect(screen.getByLabelText("Restaurant name:")).toBeInTheDocument()
    expect(screen.getByLabelText("Email address:")).toBeInTheDocument()
    expect(screen.getByLabelText("Address:")).toBeInTheDocument()
    expect(screen.getByLabelText("Phone:")).toBeInTheDocument()
    expect(screen.getByLabelText("Hours:")).toBeInTheDocument()
    expect(screen.getByText("Save changes")).toBeInTheDocument()
    expect(screen.getByText("Cancel")).toBeInTheDocument()
  })

  test("renders default profile photo when no logo is provided", () => {
    renderProfilePanel()
    const profilePhoto = screen.getByAltText("Foto de perfil")
    expect(profilePhoto).toHaveAttribute("src", expect.stringContaining("logo_default.png"))
  })

  test("updates input fields on change", () => {
    renderProfilePanel()

    const nameInput = screen.getByLabelText("Restaurant name:")
    fireEvent.change(nameInput, { target: { value: "Updated Restaurant" } })
    expect(nameInput).toHaveValue("Updated Restaurant")

    const addressInput = screen.getByLabelText("Address:")
    fireEvent.change(addressInput, { target: { value: "Updated Address" } })
    expect(addressInput).toHaveValue("Updated Address")
  })

  test("handles photo change correctly", async () => {
    renderProfilePanel()

    const file = new File(["dummy content"], "test-image.png", { type: "image/png" })

    // Selecciona l'input pel seu className
    const fileInput = document.querySelector(".photo-input")
    expect(fileInput).not.toBeNull() // Assegura que l'input existeix

    fireEvent.change(fileInput, { target: { files: [file] } })

    // Espera que l'atribut `src` de la imatge s'actualitzi
    await waitFor(() => {
      const profilePhoto = screen.getByAltText("Foto de perfil")
      expect(profilePhoto).toHaveAttribute("src", "mocked-url")
    })
  })

  test("calls updateRestaurant and navigates on save", async () => {
    apiMethods.updateRestaurant.mockResolvedValue()
    renderProfilePanel()

    fireEvent.change(screen.getByLabelText("Restaurant name:"), {
      target: { value: "Updated Restaurant" },
    })
    fireEvent.click(screen.getByText("Save changes"))

    await waitFor(() => {
      expect(apiMethods.updateRestaurant).toHaveBeenCalledWith(1, expect.any(FormData))
      expect(mockUpdateRestaurantData).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith("/home")
    })
  })

  test("navigates to home on cancel", () => {
    renderProfilePanel()

    fireEvent.click(screen.getByText("Cancel"))
    expect(mockNavigate).toHaveBeenCalledWith("/home")
  })
})

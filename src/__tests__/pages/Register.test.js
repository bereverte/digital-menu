import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import apiMethods from "api"
import Register from "pages/Register"

// Mock de l'API
jest.mock("api", () => ({
  register: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("Register Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderRegisterPage = () =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

  test("renders form fields and button", () => {
    renderRegisterPage()

    expect(screen.getByPlaceholderText("Restaurant's Name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument()
    expect(screen.getByText("Create account")).toBeInTheDocument()
    expect(screen.getByText("Already have an account?")).toBeInTheDocument()
  })

  test("shows validation errors for empty fields", async () => {
    renderRegisterPage()

    fireEvent.click(screen.getByText("Create account"))

    expect(await screen.findByText("Restaurant's name is required")).toBeInTheDocument()
    expect(await screen.findByText("email is required")).toBeInTheDocument()
    expect(await screen.findByText("password is required")).toBeInTheDocument()
    expect(await screen.findByText("confirm password is required")).toBeInTheDocument()
  })

  test("shows error if passwords do not match", async () => {
    renderRegisterPage()

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password456" },
    })
    fireEvent.click(screen.getByText("Create account"))

    expect(await screen.findByText("passwords must match")).toBeInTheDocument()
  })

  test("calls register API and navigates on successful submission", async () => {
    apiMethods.register.mockResolvedValueOnce({ data: { success: true } })

    renderRegisterPage()

    fireEvent.change(screen.getByPlaceholderText("Restaurant's Name"), {
      target: { value: "Test Restaurant" },
    })
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByText("Create account"))

    await waitFor(() => {
      expect(apiMethods.register).toHaveBeenCalledWith(
        "Test Restaurant",
        "test@example.com",
        "password123"
      )
      expect(mockNavigate).toHaveBeenCalledWith("/accounts/login")
    })
  })

  test("shows error message on API failure", async () => {
    // Mock de l'API
    apiMethods.register.mockRejectedValueOnce({
      response: { data: { error: "Registration failed" } },
    })

    // Mock de l'alert
    jest.spyOn(window, "alert").mockImplementation(() => {})

    renderRegisterPage()

    // Emplenament del formulari
    fireEvent.change(screen.getByPlaceholderText("Restaurant's Name"), {
      target: { value: "Test Restaurant" },
    })
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    })

    // Simula l'enviament del formulari
    fireEvent.click(screen.getByText("Create account"))

    // Comprova que l'alert es crida amb el text correcte
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Registration failed")
    })

    // Assegura que l'API es crida una vegada
    expect(apiMethods.register).toHaveBeenCalledTimes(1)
  })

  test("shows generic error message on network failure", async () => {
    apiMethods.register.mockRejectedValueOnce(new Error("Network Error"))

    jest.spyOn(window, "alert").mockImplementation(() => {})

    renderRegisterPage()

    fireEvent.change(screen.getByPlaceholderText("Restaurant's Name"), {
      target: { value: "Test Restaurant" },
    })
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByText("Create account"))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "An error occurred during registration. Please try again."
      )
    })
  })
})

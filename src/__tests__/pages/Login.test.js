import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Login from "pages/Login"
import { AuthContext } from "contexts/AuthContext"

const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

describe("Login Page", () => {
  const mockLogin = jest.fn()

  const renderLoginPage = () =>
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders form fields and login button", () => {
    renderLoginPage()

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(screen.getByText("Login")).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText("Register here")).toBeInTheDocument()
  })

  test("shows validation errors for empty fields", async () => {
    renderLoginPage()

    fireEvent.click(screen.getByText("Login"))

    expect(await screen.findByText("Email is required")).toBeInTheDocument()
    expect(await screen.findByText("Password is required")).toBeInTheDocument()
  })

  test("shows validation errors for invalid email", async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    })
    fireEvent.click(screen.getByText("Login"))

    expect(await screen.findByText("Invalid email address")).toBeInTheDocument()
  })

  test("calls login and navigates on successful submission", async () => {
    mockLogin.mockResolvedValueOnce()

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByText("Login"))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123")
      expect(mockNavigate).toHaveBeenCalledWith("/home")
    })
  })

  test("shows error message on failed login", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Authentication failed"))

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    })
    fireEvent.click(screen.getByText("Login"))

    expect(
      await screen.findByText("Authentication failed. Please check your credentials.")
    ).toBeInTheDocument()
    expect(mockLogin).toHaveBeenCalledWith("wrong@example.com", "wrongpassword")
  })

  test("navigates to register page when clicking 'Register here'", () => {
    renderLoginPage()

    fireEvent.click(screen.getByText("Register here"))

    expect(mockNavigate).toHaveBeenCalledWith("/register")
  })
})

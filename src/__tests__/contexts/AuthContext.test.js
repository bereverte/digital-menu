import React, { useContext } from "react"
import { render, act } from "@testing-library/react"
import { AuthContext, AuthProvider } from "contexts/AuthContext"
import apiMethods from "api"

// Mock de react-router-dom
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

// Mock d'API
jest.mock("api", () => ({
  put: jest.fn(),
  login: jest.fn(),
  updateRestaurant: jest.fn(),
  fetchRestaurant: jest.fn(),
  fetchAuthenticatedUser: jest.fn(),
}))

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  const TestComponent = () => {
    const {
      token,
      restaurantId,
      restaurantData,
      userData,
      login,
      logout,
      updateRestaurantData,
      isAuthenticated,
    } = useContext(AuthContext)

    return (
      <div>
        <p data-testid="token">{token}</p>
        <p data-testid="restaurantId">{restaurantId}</p>
        <p data-testid="restaurantData">{restaurantData ? restaurantData.name : "No data"}</p>
        <p data-testid="userData">{userData ? userData.name : "No user"}</p>
        <p data-testid="isAuthenticated">{isAuthenticated().toString()}</p>
        <button data-testid="login" onClick={() => login("test@example.com", "password123")}>
          Login
        </button>
        <button data-testid="logout" onClick={logout}>
          Logout
        </button>
        <button data-testid="update" onClick={() => updateRestaurantData({ name: "Updated Name" })}>
          Update
        </button>
      </div>
    )
  }

  test("initializes state correctly", () => {
    localStorage.setItem("token", "mockToken")
    localStorage.setItem("restaurantId", "123")

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(getByTestId("token").textContent).toBe("mockToken")
    expect(getByTestId("restaurantId").textContent).toBe("123")
    expect(getByTestId("restaurantData").textContent).toBe("No data")
    expect(getByTestId("userData").textContent).toBe("No user")
    expect(getByTestId("isAuthenticated").textContent).toBe("true")
  })

  test("login updates state and navigates correctly", async () => {
    apiMethods.login.mockResolvedValueOnce({
      data: { token: "mockToken", restaurant_id: "123" },
    })
    apiMethods.fetchRestaurant.mockResolvedValueOnce({
      data: { name: "Test Restaurant" },
    })
    apiMethods.fetchAuthenticatedUser.mockResolvedValueOnce({
      data: { name: "Test User" },
    })

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await act(async () => {
      getByTestId("login").click()
    })

    // Comprova que les funcions d'API s'han cridat
    expect(apiMethods.login).toHaveBeenCalledWith("test@example.com", "password123")
    expect(apiMethods.fetchRestaurant).toHaveBeenCalledWith("123")
    expect(apiMethods.fetchAuthenticatedUser).toHaveBeenCalledWith("123")

    // Comprova que localStorage s'ha actualitzat
    expect(localStorage.getItem("token")).toBe("mockToken")
    expect(localStorage.getItem("restaurantId")).toBe("123")

    // Comprova que la navegació a "/home" es crida
    expect(mockNavigate).toHaveBeenCalledWith("/home")
  })

  test("logout clears state and navigates to login", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    act(() => {
      getByTestId("logout").click()
    })

    // Comprova que l'estat s'ha esborrat
    expect(localStorage.getItem("token")).toBeNull()
    expect(localStorage.getItem("restaurantId")).toBeNull()
    expect(getByTestId("token").textContent).toBe("")
    expect(getByTestId("restaurantData").textContent).toBe("No data")

    // Comprova que la navegació cap a "/accounts/login" es crida
    expect(mockNavigate).toHaveBeenCalledWith("/accounts/login")
  })

  test("updateRestaurantData updates restaurantData", async () => {
    // Inicialitza l'estat inicial
    localStorage.setItem("restaurantId", "123")

    // Mock per a updateRestaurant i fetchRestaurant
    apiMethods.fetchRestaurant.mockResolvedValueOnce({
      data: { name: "Updated Restaurant" },
    })

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Simula l'acció d'actualitzar el restaurant
    await act(async () => {
      getByTestId("update").click()
    })

    // Comprova que updateRestaurant s'ha cridat correctament
    expect(apiMethods.updateRestaurant).toHaveBeenCalledWith("123", {
      name: "Updated Name",
    })

    // Comprova que fetchRestaurant s'ha cridat correctament
    expect(apiMethods.fetchRestaurant).toHaveBeenCalledWith("123")

    // Comprova que restaurantData s'ha actualitzat
    expect(getByTestId("restaurantData").textContent).toBe("Updated Restaurant")
  })
})

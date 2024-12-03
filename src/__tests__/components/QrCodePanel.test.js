import { render, screen } from "@testing-library/react"
import QRCodePanel from "components/QRCodePanel"
import { AuthContext } from "contexts/AuthContext"
import { getRestaurantUrlName } from "utils"

describe("QRCodePanel component", () => {
  const mockRestaurantData = {
    name: "Test Restaurant",
  }

  const renderQRCodePanel = () => {
    render(
      <AuthContext.Provider value={{ restaurantData: mockRestaurantData }}>
        <QRCodePanel />
      </AuthContext.Provider>
    )
  }

  test("renders a QR code as an SVG element", () => {
    renderQRCodePanel()

    const qrCode = screen.getByTestId("qr-code")
    expect(qrCode).toBeInTheDocument()

    expect(qrCode.tagName).toBe("svg")
  })

  test("renders restaurant name and helper text", () => {
    renderQRCodePanel()

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument()
    expect(screen.getByText("Scan the QR code to preview the page!")).toBeInTheDocument()
  })

  test("generates URL correctly with getRestaurantUrlName", () => {
    expect(getRestaurantUrlName("Test Restaurant")).toBe("test-restaurant")
    expect(getRestaurantUrlName("My Fancy Restaurant")).toBe("my-fancy-restaurant")
    expect(getRestaurantUrlName("Café Déjà Vu")).toBe("cafe-deja-vu")
  })
})

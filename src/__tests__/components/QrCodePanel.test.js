import { render, screen } from "@testing-library/react"
import QRCodePanel from "components/QRCodePanel"
import { AuthContext } from "contexts/AuthContext"

jest.mock("qrcode.react", () => ({
  QRCodeSVG: ({ value }) => <svg data-testid="qr-code" data-value={value} />,
}))

describe("QRCodePanel component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockRestaurantData = {
    name: "Test Restaurant",
  }

  const renderQRCodePanel = () => {
    render(
      <AuthContext.Provider value={{ restaurantData: mockRestaurantData, restaurantId: 1 }}>
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

  test("renders 'Loading...' if restaurantId or restaurantData is missing", () => {
    render(
      <AuthContext.Provider value={{ restaurantData: null, restaurantId: null }}>
        <QRCodePanel />
      </AuthContext.Provider>
    )

    expect(screen.getByText("Loading...")).toBeInTheDocument()
    expect(screen.queryByTestId("qr-code")).not.toBeInTheDocument()
  })

  test("generates the correct URL for the QR code", () => {
    const mockRestaurantId = 1
    const mockBaseUrl = "https://digitalmenu-khaki.vercel.app"

    renderQRCodePanel(mockRestaurantId)

    const qrCode = screen.getByTestId("qr-code")

    expect(qrCode).toHaveAttribute("data-value", `${mockBaseUrl}/menu/${mockRestaurantId}`)
  })
})

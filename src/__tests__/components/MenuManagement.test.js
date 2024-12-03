import { render, screen, fireEvent } from "@testing-library/react"
import MenuManagement from "components/MenuManagement"

describe("MenuManagement component", () => {
  const mockToggleForm = jest.fn()

  beforeEach(() => {
    // Reseteja el mock abans de cada test
    mockToggleForm.mockClear()
  })

  test("renders Menu Management header and rows", () => {
    render(<MenuManagement toggleForm={mockToggleForm} />)

    // Verifica que el text del títol es mostra
    expect(screen.getByText("Menu Management")).toBeInTheDocument()

    // Verifica que es mostren els encapçalaments de categories i ítems
    expect(screen.getByText("Categories")).toBeInTheDocument()
    expect(screen.getByText("Items (dishes and drinks)")).toBeInTheDocument()
  })

  test("calls toggleForm with correct arguments when clicking categories header", () => {
    render(<MenuManagement toggleForm={mockToggleForm} />)

    // Simula clic a "Categories"
    fireEvent.click(screen.getByText("Categories"))
    expect(mockToggleForm).toHaveBeenCalledWith("Categories", false)
  })

  test("calls toggleForm with correct arguments when clicking categories add icon", () => {
    render(<MenuManagement toggleForm={mockToggleForm} />)

    // Simula clic a la icona de "Categories"
    const plusIcons = screen.getAllByAltText("Add icon")
    fireEvent.click(plusIcons[0]) // La primera icona és per Categories
    expect(mockToggleForm).toHaveBeenCalledWith("Categories", true)
  })

  test("calls toggleForm with correct arguments when clicking items header", () => {
    render(<MenuManagement toggleForm={mockToggleForm} />)

    // Simula clic a "Items (dishes and drinks)"
    fireEvent.click(screen.getByText("Items (dishes and drinks)"))
    expect(mockToggleForm).toHaveBeenCalledWith("Menu Items", false)
  })

  test("calls toggleForm with correct arguments when clicking items add icon", () => {
    render(<MenuManagement toggleForm={mockToggleForm} />)

    // Simula clic a la icona de "Items"
    const plusIcons = screen.getAllByAltText("Add icon")
    fireEvent.click(plusIcons[1]) // La segona icona és per Items
    expect(mockToggleForm).toHaveBeenCalledWith("Menu Items", true)
  })
})

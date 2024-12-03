import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import DetailsPanel from "components/DetailsPanel"
import { RestaurantContext } from "contexts/RestaurantContext"
import apiMethods from "api"

jest.mock("api", () => ({
  fetchCategories: jest.fn(),
  fetchMenuItems: jest.fn(),
}))

jest.mock("axios")

describe("DetailsPanel component", () => {
  const mockToggleForm = jest.fn()
  const mockCategories = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ]
  const mockMenuItems = [
    { id: 1, name: "Item 1", price: 10, category_names: ["Category 1"], is_available: true },
    { id: 2, name: "Item 2", price: 20, category_names: ["Category 2"], is_available: false },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderDetailsPanel = props => {
    return render(
      <RestaurantContext.Provider value={{ categories: mockCategories }}>
        <DetailsPanel
          selectedSection={props.selectedSection}
          restaurantId={1}
          showForm={props.showForm || false}
          toggleForm={mockToggleForm}
        />
      </RestaurantContext.Provider>
    )
  }

  test("renders DetailsPanel header and controls", () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: mockCategories })

    renderDetailsPanel({ selectedSection: "Categories" })

    expect(screen.getByText("Categories")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument()
    expect(screen.getByText("Add Category")).toBeInTheDocument()
  })

  test("displays loading message while fetching data", () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: [] })

    renderDetailsPanel({ selectedSection: "Categories" })

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  test("fetches and displays categories", async () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: mockCategories })

    renderDetailsPanel({ selectedSection: "Categories" })

    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument()
      expect(screen.getByText("Category 2")).toBeInTheDocument()
    })
  })

  test("fetches and displays menu items", async () => {
    apiMethods.fetchMenuItems.mockResolvedValue({ data: mockMenuItems })

    renderDetailsPanel({ selectedSection: "Menu Items" })

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument()
      expect(screen.getByText("Item 2")).toBeInTheDocument()
    })
  })

  test("calls toggleForm with correct arguments on add button click", () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: mockCategories })

    renderDetailsPanel({ selectedSection: "Categories" })

    fireEvent.click(screen.getByText("Add Category"))
    expect(mockToggleForm).toHaveBeenCalledWith("Categories", true)
  })

  test("filters data by search term", async () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: mockCategories })

    renderDetailsPanel({ selectedSection: "Categories" })

    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument()
      expect(screen.getByText("Category 2")).toBeInTheDocument()
    })

    // Filtrar per terme de cerca
    fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "Category 1" } })

    expect(screen.getByText("Category 1")).toBeInTheDocument()
    expect(screen.queryByText("Category 2")).not.toBeInTheDocument()
  })

  test("shows and handles deletion modal for categories", async () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: mockCategories })
    apiMethods.deleteCategory = jest.fn().mockResolvedValue()

    renderDetailsPanel({ selectedSection: "Categories" })

    // Espera que es carreguin les categories
    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument()
    })

    // Simula clic a eliminar
    const deleteButtons = screen.getAllByAltText("Delete icon")
    fireEvent.click(deleteButtons[0]) // Primer botó d'eliminar

    // Comprova que es mostra el modal de confirmació
    expect(screen.getByText('Are you sure you want to delete "Category 1"?')).toBeInTheDocument()

    // Simula confirmació d'eliminació
    fireEvent.click(screen.getByText("Confirm"))
    await waitFor(() => {
      expect(apiMethods.deleteCategory).toHaveBeenCalledWith(1, 1) // restaurantId = 1, categoryId = 1
    })
  })

  test("handles edit item correctly", async () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: mockCategories })

    renderDetailsPanel({ selectedSection: "Categories" })

    // Espera que es carreguin les categories
    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument()
    })

    // Simula clic a editar
    const editButtons = screen.getAllByAltText("Edit icon")
    fireEvent.click(editButtons[0]) // Primer botó d'editar

    // Comprova que toggleForm és cridat amb la categoria seleccionada
    expect(mockToggleForm).toHaveBeenCalledWith("Categories", true)
  })

  test("renders 'No results' when no categories are available", async () => {
    apiMethods.fetchCategories.mockResolvedValue({ data: [] })

    renderDetailsPanel({ selectedSection: "Categories" })

    await waitFor(() => {
      expect(screen.getByText("No results")).toBeInTheDocument()
    })
  })

  test("handles availability toggle correctly", async () => {
    apiMethods.fetchMenuItems.mockResolvedValue({ data: mockMenuItems })
    apiMethods.updateMenuItemAvailability = jest.fn().mockResolvedValue()

    renderDetailsPanel({ selectedSection: "Menu Items" })

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument()
    })

    // Selecciona els `Switch` utilitzant `querySelector`
    const switches = document.querySelectorAll(".custom-switch input")

    // Simula clic al primer `Switch`
    fireEvent.click(switches[0])
    expect(apiMethods.updateMenuItemAvailability).toHaveBeenCalledWith(1, 1)

    // Simula clic al segon `Switch`
    fireEvent.click(switches[1])
    expect(apiMethods.updateMenuItemAvailability).toHaveBeenCalledWith(1, 2)
  })
})

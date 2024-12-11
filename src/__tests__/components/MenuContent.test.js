import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import MenuContent from "components/MenuContent"

describe("MenuContent component", () => {
  const mockCategories = [
    { id: 1, name: "Starters" },
    { id: 2, name: "Main Courses" },
  ]

  const mockMenuItems = [
    {
      id: 201,
      name: "Bruschetta",
      description: "Tasty appetizer",
      price: 7,
      is_available: true,
      categories: [1],
    },
    {
      id: 202,
      name: "Pasta",
      description: "Delicious pasta",
      price: 12,
      is_available: true,
      categories: [2],
    },
    {
      id: 203,
      name: "Unavailable Item",
      description: "Not currently available",
      price: 15,
      is_available: false,
      categories: [1],
    },
  ]

  const renderMenuContent = () => {
    render(<MenuContent categories={mockCategories} menuItems={mockMenuItems} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders categories and menu items", () => {
    renderMenuContent()

    expect(screen.getByText("Starters")).toBeInTheDocument()
    expect(screen.getByText("Main Courses")).toBeInTheDocument()

    expect(screen.getByText("Bruschetta")).toBeInTheDocument()
    expect(screen.getByText("Tasty appetizer")).toBeInTheDocument()
    expect(screen.getByText("7 €")).toBeInTheDocument()

    expect(screen.queryByText("Unavailable Item")).not.toBeInTheDocument()
    expect(screen.queryByText("Pasta")).not.toBeInTheDocument()
  })

  test("renders menu items for the selected category", () => {
    renderMenuContent()

    fireEvent.click(screen.getByText("Main Courses"))

    expect(screen.getByText("Pasta")).toBeInTheDocument()
    expect(screen.getByText("Delicious pasta")).toBeInTheDocument()
    expect(screen.getByText("12 €")).toBeInTheDocument()

    expect(screen.queryByText("Bruschetta")).not.toBeInTheDocument()
  })

  test("does not render categories with no active menu items", () => {
    const emptyCategory = { id: 3, name: "Drinks" }

    render(
      <MenuContent categories={[...mockCategories, emptyCategory]} menuItems={mockMenuItems} />
    )

    expect(screen.queryByText("Drinks")).not.toBeInTheDocument()
  })

  test("switches back to previous category items after navigation", () => {
    renderMenuContent()

    fireEvent.click(screen.getByText("Main Courses"))

    expect(screen.getByText("Pasta")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Starters"))

    expect(screen.getByText("Bruschetta")).toBeInTheDocument()
  })
})

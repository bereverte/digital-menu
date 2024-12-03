import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { RestaurantContext } from "contexts/RestaurantContext"
import MenuContent from "components/MenuContent"

test("renders categories and menu items", () => {
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
  ]

  render(
    <RestaurantContext.Provider value={{ categories: mockCategories, menuItems: mockMenuItems }}>
      <MenuContent />
    </RestaurantContext.Provider>
  )

  expect(screen.getByText("Starters")).toBeInTheDocument()
  expect(screen.getByText("Main Courses")).toBeInTheDocument()

  expect(screen.getByText("Bruschetta")).toBeInTheDocument()
  expect(screen.getByText("Tasty appetizer")).toBeInTheDocument()
  expect(screen.getByText("7 €")).toBeInTheDocument()

  fireEvent.click(screen.getByText("Main Courses"))
  expect(screen.getByText("Pasta")).toBeInTheDocument()
  expect(screen.getByText("Delicious pasta")).toBeInTheDocument()
  expect(screen.getByText("12 €")).toBeInTheDocument()
})

import React, { useState, useEffect } from "react"
import { Tabs, TabList, Tab, TabPanel } from "react-tabs"
import "../styles/MenuPage.scss"
import apiMethods from "../api"

export default function MenuPage() {
  const restaurantId = localStorage.getItem("restaurantId")
  const restaurantName = localStorage.getItem("restaurantName")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const categoriesResponse = await apiMethods.fetchCategories(restaurantId)
        const menuItemsResponse = await apiMethods.fetchMenuItems(restaurantId)

        const categoriesWithItems = categoriesResponse.data.map(category => ({
          ...category,
          items: menuItemsResponse.data.filter(item => item.categories.includes(category.id)),
        }))

        setCategories(categoriesWithItems)
      } catch (error) {
        console.error("Error fetching menu:", error)
      }
    }

    fetchMenu()
  }, [restaurantId])

  return (
    <div className="menu-page">
      <h1>{restaurantName}</h1>
      <Tabs>
        <TabList>
          {categories.map(category => (
            <Tab key={category.id}>{category.name}</Tab>
          ))}
        </TabList>

        {categories.map(category => (
          <TabPanel key={category.id}>
            <div className="menu-items">
              {category.items.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-name-description">
                    <p className="name">{item.name}</p>
                    <p className="description">{item.description}</p>
                  </div>
                  <div className="menu-item-price">
                    <p className="price">{item.price} €</p>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}

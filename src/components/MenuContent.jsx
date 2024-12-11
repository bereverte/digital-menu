import React from "react"
import { Tabs, TabList, Tab, TabPanel } from "react-tabs"

export default function MenuContent({ categories, menuItems }) {
  const activeMenuItems = menuItems.filter(item => item.is_available)

  // Filtra categories que tenen almenys un ítem disponible
  const filteredCategories = categories.filter(category =>
    activeMenuItems.some(item => item.categories.includes(category.id))
  )

  return (
    <div className="menu-content">
      <Tabs>
        <TabList>
          {filteredCategories.map(category => (
            <Tab key={category.id}>{category.name}</Tab>
          ))}
        </TabList>

        {filteredCategories.map(category => (
          <TabPanel key={category.id}>
            <div className="menu-items">
              {activeMenuItems
                .filter(item => item.categories.includes(category.id))
                .map(item => (
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

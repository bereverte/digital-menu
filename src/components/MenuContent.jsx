import React, { useContext } from "react"
import { RestaurantContext } from "contexts/RestaurantContext"
import { Tabs, TabList, Tab, TabPanel } from "react-tabs"

export default function MenuContent() {
  const { categories, menuItems } = useContext(RestaurantContext)

  const activeMenuItems = menuItems.filter(item => item.is_available)

  return (
    <div className="menu-content">
      <Tabs>
        <TabList>
          {categories.map(category => (
            <Tab key={category.id}>{category.name}</Tab>
          ))}
        </TabList>

        {categories.map(category => (
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

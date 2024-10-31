import React from "react"
import plusIcon from "../assets/icons/plus.svg"

export default function MenuManagement({ toggleForm }) {
  return (
    <div className="menu-management-container">
      <div className="menu-management-header">Menu Management</div>
      <table className="menu-management-table">
        <tbody>
          <tr className="menu-management-row">
            <th onClick={() => toggleForm("Categories", false)}>Categories</th>
            <td>
              <img
                src={plusIcon}
                alt="Add icon"
                className="plus icon"
                onClick={() => toggleForm("Categories", true)}
              />
            </td>
          </tr>
          <tr className="menu-management-row">
            <th onClick={() => toggleForm("Menu Items", false)}>Items (dishes and drinks)</th>
            <td>
              <img
                src={plusIcon}
                alt="Add icon"
                className="plus icon"
                onClick={() => toggleForm("Menu Items", true)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

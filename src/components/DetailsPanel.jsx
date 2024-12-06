import React, { useEffect, useState, useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { RestaurantContext } from "contexts/RestaurantContext"
import * as Yup from "yup"
import apiMethods from "api"
import plusIcon from "assets/icons/plus-white.svg"
import searchIcon from "assets/icons/search.svg"
import editIcon from "assets/icons/edit.svg"
import deleteIcon from "assets/icons/x.svg"
import Switch from "react-switch"

export default function DetailsPanel({ selectedSection, restaurantId, showForm, toggleForm }) {
  const [data, setData] = useState([])
  const { categories, setCategories, setMenuItems } = useContext(RestaurantContext)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [filteredCategory, setFilteredCategory] = useState(null)
  const [statuses, setStatuses] = useState({})

  useEffect(() => {
    setSearchTerm("")
    setFilteredCategory(null)
    setLoading(true)

    console.log("Categories:", categories)

    if (selectedSection === "Categories") {
      apiMethods
        .fetchCategories(restaurantId)
        .then(response => {
          console.log("Categories response:", response.data)
          setData(response.data)
          setLoading(false)
        })
        .catch(error => console.error("Error fetching categories:", error))
    } else if (selectedSection === "Menu Items") {
      apiMethods
        .fetchMenuItems(restaurantId)
        .then(response => {
          console.log("Menu Items response:", response.data)
          setData(response.data)

          // Establecer los estados de disponibilidad para los items del menú
          const initialStatuses = {}
          response.data.forEach(item => {
            initialStatuses[item.id] = item.is_available // Asegúrate de que 'is_available' esté en la respuesta
          })
          setStatuses(initialStatuses) // Actualiza el estado de `statuses`

          setLoading(false)
        })
        .catch(error => console.error("Error fetching menu items:", error))
    }
  }, [selectedSection, restaurantId])

  const openModal = item => {
    setItemToDelete(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setItemToDelete(null)
  }

  const handleDeleteConfirmed = () => {
    if (itemToDelete) {
      const deleteFunc =
        selectedSection === "Categories" ? apiMethods.deleteCategory : apiMethods.deleteMenuItem

      deleteFunc(restaurantId, itemToDelete.id)
        .then(() => {
          setData(prevData => prevData.filter(item => item.id !== itemToDelete.id))
          selectedSection === "Categories"
            ? setCategories(prevCategories =>
                prevCategories.filter(category => category.id !== itemToDelete.id)
              )
            : setMenuItems(prevMenuItems =>
                prevMenuItems.filter(menuItem => menuItem.id !== itemToDelete.id)
              )
          closeModal()
        })
        .catch(error => console.error("Error deleting item:", error))
    }
  }

  const handleEditItem = item => {
    setEditingItem(item)
    toggleForm(selectedSection, true)
  }

  const handleCancel = () => {
    setEditingItem(null)
    toggleForm(selectedSection)
  }

  const validationSchema = Yup.object().shape({
    ...(selectedSection === "Categories" && {
      name: Yup.string()
        .required("name is a required field")
        .test("unique-category", "This category name already exists", async value => {
          if (!value) return true // Si no hay valor, no validamos
          const response = await apiMethods.checkCategoryExists(restaurantId, value)
          return !response.data.exists // Retorna true si no existe
        }),
    }),

    ...(selectedSection === "Menu Items" && {
      name: Yup.string()
        .required("name is a required field")
        .test(
          "unique-menu-item",
          "This menu item already exists in this category",
          async function (value) {
            const { categories, id } = this.parent // Obtenim les categories i l'ID si estem editant

            if (!value || categories.length === 0) return true // Si no hi ha nom o categories, no validem

            // Si estem editant, no validem el mateix ítem
            if (id) {
              return true // No cridem l'API si estem editant
            }

            // Crida a l'API per verificar si existeix un ítem de menú amb el mateix nom i categories
            const response = await apiMethods.checkMenuItemExists(restaurantId, value, categories)
            return !response.data.exists
          }
        ),
      categories: Yup.array().min(1, "select at least one category"),
      price: Yup.number().min(0.01, "invalid price").required("price is a required field"),
    }),
  })

  const initialValues = editingItem
    ? editingItem
    : selectedSection === "Categories"
    ? { name: "" }
    : { categories: [], name: "", description: "", price: "" }

  const handleSubmit = (values, { resetForm }) => {
    if (editingItem) {
      // Editando item o categoría
      const updateFunc = () => {
        return selectedSection === "Categories"
          ? apiMethods.updateCategory(restaurantId, editingItem.id, { name: values.name })
          : apiMethods.updateMenuItem(restaurantId, editingItem.id, values)
      }

      updateFunc()
        .then(response => {
          setData(prevData =>
            prevData.map(item => (item.id === editingItem.id ? response.data : item))
          )
          selectedSection === "Categories"
            ? setCategories(prevCategories =>
                prevCategories.map(category =>
                  category.id === editingItem.id ? response.data : category
                )
              )
            : setMenuItems(prevMenuItems =>
                prevMenuItems.map(menuItem =>
                  menuItem.id === editingItem.id ? response.data : menuItem
                )
              )
          resetForm()
          setEditingItem(null) // Reseteamos el ítem en edición
          toggleForm(false)
        })
        .catch(error => console.error("Error updating item:", error))
    } else {
      // Creando nuevo item o categoría
      const addFunc = () => {
        return selectedSection === "Categories"
          ? apiMethods.createCategory(restaurantId, { name: values.name })
          : apiMethods.createMenuItem(restaurantId, values)
      }

      addFunc()
        .then(response => {
          setData(prevData => [...prevData, response.data])
          selectedSection === "Categories"
            ? setCategories(prevCategories => [...prevCategories, response.data])
            : setMenuItems(prevMenuItems => [...prevMenuItems, response.data])
          resetForm()
          toggleForm(false)
        })
        .catch(error => console.error("Error creating item:", error))
    }
  }

  const handleCategoryChipChange = (categoryId, values, setFieldValue) => {
    const updatedCategories = values.categories.includes(categoryId)
      ? values.categories.filter(id => id !== categoryId)
      : [...values.categories, categoryId]
    setFieldValue("categories", updatedCategories)
  }

  const handleCategoryFilterChange = categoryId => {
    setFilteredCategory(categoryId)
  }

  useEffect(() => {
    console.log("Restaurant ID:", restaurantId)
  }, [restaurantId])

  const handleStatusChange = async itemId => {
    // Asegúrate de pasar restaurantId y itemId
    const newStatus = !statuses[itemId]

    // Actualiza el estado del switch en el frontend
    setStatuses(prevStatuses => ({
      ...prevStatuses,
      [itemId]: newStatus,
    }))

    try {
      // Envía la actualización al backend, pasando restaurantId y itemId
      await apiMethods.updateMenuItemAvailability(restaurantId, itemId)
      console.log("Availability updated in the database")
    } catch (error) {
      console.error("Failed to update availability:", error)
      // Si ocurre un error, puedes revertir el cambio en el estado
      setStatuses(prevStatuses => ({
        ...prevStatuses,
        [itemId]: !newStatus,
      }))
    }
  }

  const filteredData = data.filter(item => {
    if (filteredCategory) {
      return (
        item.category_names.includes(filteredCategory) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } else {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
  })

  return (
    <div className="details-panel-container">
      <div className="details-panel-header">{selectedSection}</div>
      {!showForm && (
        <>
          <div className="details-panel-controls">
            <div className="search-container">
              <img src={searchIcon} alt="Search icon" className="search icon" />
              <input
                type="text"
                id="search"
                placeholder="Search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="add-button-container" onClick={() => toggleForm(selectedSection, true)}>
              <img src={plusIcon} alt="Plus icon" className="plus icon" />
              <p>{selectedSection === "Categories" ? "Add Category" : "Add Menu Item"}</p>
            </div>
          </div>

          <div className="details-panel-table">
            {loading ? (
              <p className="loading message">Loading...</p>
            ) : filteredData.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    {selectedSection === "Categories" && <th>Name</th>}
                    {selectedSection === "Menu Items" && (
                      <>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Availability</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedSection === "Categories" &&
                    filteredData.map(category => (
                      <tr key={category.id} className="category-data-row">
                        <td>{category.name}</td>
                        <td className="td-icons">
                          <img
                            src={editIcon}
                            alt="Edit icon"
                            className="edit icon"
                            onClick={() => handleEditItem(category)}
                          />
                          <img
                            src={deleteIcon}
                            alt="Delete icon"
                            className="delete icon"
                            onClick={() => openModal(category)}
                          />
                        </td>
                      </tr>
                    ))}
                  {selectedSection === "Menu Items" &&
                    filteredData.map(item => (
                      <tr key={item.id} className="item-data-row">
                        <td>{item.name}</td>
                        <td>
                          {Array.isArray(item.category_names)
                            ? item.category_names.join(", ")
                            : "No categories"}
                        </td>
                        <td>{item.price}</td>
                        <td className="custom-switch">
                          <Switch
                            onChange={() => handleStatusChange(item.id)}
                            checked={statuses[item.id] || false}
                            onColor="#4caf50"
                            offColor="#ccc"
                            width={40}
                            height={20}
                          />
                        </td>
                        <td className="td-icons">
                          <img
                            src={editIcon}
                            alt="Edit icon"
                            className="edit icon"
                            onClick={() => handleEditItem(item)}
                          />
                          <img
                            src={deleteIcon}
                            alt="Delete icon"
                            className="delete icon"
                            onClick={() => openModal(item)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="no-results message">No results</p>
            )}

            {selectedSection === "Menu Items" && categories && (
              <div className="filter-container">
                <h4>Filter by category</h4>
                <div className="filter-category-container">
                  <p
                    className={filteredCategory === null ? "selected-category" : "all category"}
                    onClick={() => handleCategoryFilterChange(null)}
                  >
                    All
                  </p>
                  {categories.map(category => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryFilterChange(category.name)}
                    >
                      <p
                        className={
                          filteredCategory === category.name ? "selected-category" : "category"
                        }
                      >
                        {category.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {showForm && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="form-container">
              <h3>Add new {selectedSection === "Categories" ? "category" : "menu item"}</h3>

              {selectedSection === "Categories" && (
                <div className="form-group">
                  <label htmlFor="category_name">
                    Name:<span className="required-asterisk">*</span>
                  </label>
                  <div className="input-container">
                    <Field
                      type="text"
                      id="category_name"
                      name="name"
                      className={
                        "form-control" + (errors.name && touched.name ? " is-invalid" : "")
                      }
                    />
                    <ErrorMessage
                      name="name"
                      id="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
              )}

              {selectedSection === "Menu Items" && (
                <>
                  <div className="form-group">
                    <label>
                      Categories:<span className="required-asterisk">*</span>{" "}
                    </label>
                    <div className="input-container">
                      <div className="category-chips">
                        {categories &&
                          categories.map(category => (
                            <div
                              key={category.id}
                              className={`chip ${
                                Array.isArray(values.categories) &&
                                values.categories.includes(category.id)
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                handleCategoryChipChange(category.id, values, setFieldValue)
                              }
                            >
                              {category.name}
                            </div>
                          ))}
                      </div>
                      <ErrorMessage
                        name="categories"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">
                      Name:<span className="required-asterisk">*</span>
                    </label>
                    <div className="input-container">
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className={
                          "form-control" + (errors.name && touched.name ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        id="name"
                        name="name"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description: </label>
                    <Field as="textarea" id="description" name="description" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">
                      Price:<span className="required-asterisk">*</span>
                    </label>
                    <div className="input-container">
                      <Field
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        className={
                          "form-control" + (errors.price && touched.price ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage name="price" component="div" className="invalid-feedback" />
                    </div>
                  </div>
                </>
              )}

              <div className="form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {showModal && (
        <div className="modal-container">
          <div className="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete "{itemToDelete.name}"?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirmed}>Confirm</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token") // Obtener el token desde el localStorage
  if (token) {
    config.headers.Authorization = `Token ${token}` // Agregar el token a las cabeceras si existe
  }
  return config
})

// Funciones para la autenticación
export const login = (email, password) => {
  return api.post("/token-auth/", {
    username: email,
    password: password,
  })
}

export const register = (restaurantName, email, password) => {
  return api.post("/api/register/", {
    restaurant_name: restaurantName,
    email: email,
    password: password,
  })
}

export const fetchCategories = restaurantId => {
  return api.get(`api/restaurants/${restaurantId}/categories/`)
}

export const createCategory = (restaurantId, categoryData) => {
  return api.post(`api/restaurants/${restaurantId}/categories/`, categoryData)
}

export const deleteCategory = (restaurantId, categoryId) => {
  return api.delete(`api/restaurants/${restaurantId}/categories/${categoryId}/`)
}

export const updateCategory = (restaurantId, categoryId, categoryData) => {
  return api.put(`api/restaurants/${restaurantId}/categories/${categoryId}/`, categoryData)
}

export const fetchMenuItems = restaurantId => {
  return api.get(`api/restaurants/${restaurantId}/menuItems/`)
}

export const createMenuItem = (restaurantId, menuItem) => {
  return api.post(`api/restaurants/${restaurantId}/menuItems/`, menuItem)
}

export const updateMenuItem = (restaurantId, menuItem, menuItemData) => {
  return api.put(`api/restaurants/${restaurantId}/menuItems/${menuItem}/`, menuItemData)
}

export const deleteMenuItem = (restaurantId, menuItemId) => {
  return api.delete(`api/restaurants/${restaurantId}/menuItems/${menuItemId}/`)
}

export const checkCategoryExists = (restaurantId, categoryName) => {
  return api.get(`api/restaurants/${restaurantId}/categories/check/?name=${categoryName}`)
}

export const checkMenuItemExists = (restaurantId, itemName, categoryIds) => {
  const categoriesQuery = categoryIds.join(",")
  return api.get(
    `api/restaurants/${restaurantId}/menuItems/check/?name=${itemName}&categories=${categoriesQuery}`
  )
}

export const fetchRestaurant = restaurantId => {
  return api.get(`/api/restaurants/${restaurantId}/`)
}

export const updateRestaurant = (restaurantId, formData) => {
  return api.put(`/api/restaurants/${restaurantId}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updateMenuItemAvailability = (restaurantId, itemId) => {
  return api.patch(`/api/restaurants/${restaurantId}/menuItems/${itemId}/toggle-availability/`)
}

export const fetchAuthenticatedUser = restaurantId => {
  return api.get(`/api/restaurants/${restaurantId}/users/me/`)
}

const apiMethods = {
  login,
  register,
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  checkCategoryExists,
  checkMenuItemExists,
  fetchRestaurant,
  updateRestaurant,
  updateMenuItemAvailability,
  fetchAuthenticatedUser,
}

export default apiMethods

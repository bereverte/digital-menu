export const getRestaurantUrlName = name => {
  return encodeURIComponent(
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase()
  )
}

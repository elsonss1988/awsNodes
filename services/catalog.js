import baseAPI from "./config/axios.js";

export function getProductById(id) {
  return baseAPI.get('/catalog_system/pub/products/variations/' + id);
}
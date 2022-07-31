import baseAPI from "./config/axios.js";

export function getProdutoByProductId(id) {
  return baseAPI.get('/catalog_system/pub/products/variations/' + id);
}
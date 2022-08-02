import baseAPI from "./config/axios.js";

export function getOrderById(orderId) {
  return baseAPI.get('/oms/pvt/orders/' + orderId);
}
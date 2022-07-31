import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const baseAPI = axios.create({
  baseURL: "https://speedware.vtexcommercestable.com.br/api",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-VTEX-API-AppKey': process.env.X_VTEX_API_AppKey,
    'X-VTEX-API-AppToken': process.env.X_VTEX_API_AppToken
  }
});

export default baseAPI;
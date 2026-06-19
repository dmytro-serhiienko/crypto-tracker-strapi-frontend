// Общий axios-клиент для запросов к Strapi API
import axios from "axios";

export const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
});

export default api;

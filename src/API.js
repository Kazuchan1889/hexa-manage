// frontend/src/API.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/Act", // backend Node.js, bukan langsung IP device
});

export default API;

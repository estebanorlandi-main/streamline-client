import axios from "axios";

// export const api = axios.create({ baseURL: `http://localhost:3000/api/app` });
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

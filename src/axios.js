import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.25.10:31280/proxy/8000", // Backend base URL
  withCredentials: true, // Include cookies (important for authentication)
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log("[Axios Request]", config.method?.toUpperCase(), config.url, config.data || {});
    return config;
  },
  (error) => {
    console.error("[Axios Request Error]", error.message || error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("[Axios Response]", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("[Axios Response Error]", error);
    if (error.response) {
      // Alert with status and message
      alert(`Error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`);
    } else {
      // Network or CORS error
      alert("Network error. Please ensure the backend is configured correctly.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

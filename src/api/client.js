import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL;

console.log(
    "API BASE URL:",
    API_BASE_URL
);

// =====================================================
// AXIOS CLIENT
// =====================================================

const client = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    },
 
    timeout: 30000
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

client.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        console.log(
            "API REQUEST:",
            `${config.baseURL}${config.url}`
        );

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }

);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

client.interceptors.response.use(

    (response) => {

        console.log(
            "API RESPONSE:",
            response.status,
            response.config.url
        );

        return response;
    },

    (error) => {

        console.error(
            "API ERROR:",
            error.response?.status,
            error.response?.data ||
            error.message
        );

        return Promise.reject(error);
    }

);

export default client;
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log("API BASE URL:", API_BASE_URL);

const client = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    },

    timeout: 15000

});


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


export default client;
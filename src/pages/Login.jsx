import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    authApi
} from "../api/endpoints";

import {
    useAuth
} from "../context/AuthContext";


export default function Login() {

    const navigate =
        useNavigate();

    const {
        login
    } = useAuth();


    const [form, setForm] =
        useState({
            email: "",
            password: ""
        });


    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =================================================
    // INPUT CHANGE
    // =================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };


    // =================================================
    // LOGIN
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // Validation
        if (!form.email.trim()) {

            setError(
                "Email is required."
            );

            return;
        }

        if (!form.password.trim()) {

            setError(
                "Password is required."
            );

            return;
        }


        try {

            setLoading(true);


            // Call Spring Boot
            const response =
                await authApi.login(form);


            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            /*
             Backend response:

             {
                 token: "...",
                 email: "...",
                 role: "HR"
             }
            */


            const {
                token,
                email,
                role
            } = response.data;


            if (!token) {

                setError(
                    "Login successful but JWT token was not received."
                );

                return;
            }


            if (!role) {

                setError(
                    "Login successful but user role was not received."
                );

                return;
            }


            // Save authentication
            login({
                token,
                email,
                role
            });


            // =================================================
            // ROLE BASED REDIRECT
            // =================================================

            if (role === "HR") {

                navigate(
                    "/hr/dashboard"
                );

            } else if (
                role === "EMPLOYEE"
            ) {

                navigate(
                    "/employee/dashboard"
                );

            } else {

                setError(
                    `Unknown user role: ${role}`
                );
            }


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            if (
                error.response
                    ?.status === 401
            ) {

                setError(
                    "Invalid email or password."
                );

            } else if (
                error.response
                    ?.status === 400
            ) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Invalid login request."
                );

            } else if (
                error.response
                    ?.status === 500
            ) {

                setError(
                    "Server error. Check Spring Boot console."
                );

            } else {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to connect to backend."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <form
                className="login-card"
                onSubmit={handleSubmit}
            >

                <h1>
                    HRM System
                </h1>

                <p>
                    Sign in to continue
                </p>


                {error && (

                    <div className="alert error">
                        {error}
                    </div>

                )}


                <label>
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    autoComplete="email"
                />


                <label>
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="current-password"
                />


                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Signing in..."
                        : "Login"
                    }

                </button>

            </form>

        </div>
    );
}
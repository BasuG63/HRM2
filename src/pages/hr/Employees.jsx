import React, { useEffect, useState } from "react";
import { employeeApi } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";

export default function Employees() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    // Search
    const [searchType, setSearchType] = useState("code");
    const [searchValue, setSearchValue] = useState("");

    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD ALL EMPLOYEES
    // =====================================================

    const loadEmployees = async () => {

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const response =
                await employeeApi.getAll();

            console.log(
                "EMPLOYEE LIST:",
                response.data
            );

            setEmployees(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "GET EMPLOYEES ERROR:",
                error
            );

            setEmployees([]);

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load employees"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadEmployees();

    }, []);


    // =====================================================
    // SEARCH EMPLOYEE
    // =====================================================

    const searchEmployee = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const value =
            searchValue.trim();


        // Empty search
        if (!value) {

            setError(
                `Please enter ${
                    searchType === "code"
                        ? "Employee Code"
                        : "Phone Number"
                }.`
            );

            return;
        }


        // =================================================
        // VALIDATE PHONE
        // =================================================

        if (
            searchType === "phone" &&
            !/^\d{10}$/.test(value)
        ) {

            setError(
                "Phone number must contain exactly 10 digits."
            );

            return;
        }


        try {

            setSearching(true);


            let response;


            // =================================================
            // SEARCH BY EMPLOYEE CODE
            // =================================================

            if (searchType === "code") {

                response =
                    await employeeApi.searchByCode(
                        value.toUpperCase()
                    );

            }


            // =================================================
            // SEARCH BY PHONE
            // =================================================

            else {

                response =
                    await employeeApi.searchByPhone(
                        value
                    );

            }


            console.log(
                "SEARCH RESULT:",
                response.data
            );


            // =================================================
            // DISPLAY RESULT
            // =================================================

            if (response.data) {

                setEmployees([
                    response.data
                ]);

                setSuccess(
                    `Employee found successfully.`
                );

            } else {

                setEmployees([]);

                setError(
                    "Employee not found."
                );
            }


        } catch (error) {

            console.error(
                "SEARCH EMPLOYEE ERROR:",
                error
            );

            setEmployees([]);

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Employee not found."
            );

        } finally {

            setSearching(false);

        }
    };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const clearSearch = async () => {

        setSearchValue("");

        setError("");
        setSuccess("");

        await loadEmployees();
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleDateString("en-IN");
    };


    return (

        <div>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-head">

                <div>

                    <h1>
                        Employees
                    </h1>

                    <p>
                        Create and manage employees.
                    </p>

                </div>


               <button
    type="button"
    className="btn btn-primary"
    onClick={() =>
        navigate("/hr/employees/add")
    }
>
    + Add Employee
</button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="alert error">
                    {error}
                </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="alert success">
                    {success}
                </div>

            )}


            {/* =================================================
                SEARCH CARD
            ================================================= */}

            <div className="card">

                <h2>
                    Search Employee
                </h2>

                <p>
                    Search using Employee Code
                    or Phone Number.
                </p>


                <form
                    onSubmit={searchEmployee}
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "end",
                        marginTop: "15px",
                        flexWrap: "wrap"
                    }}
                >


                    {/* SEARCH TYPE */}

                    <div className="field">

                        <label>
                            Search By
                        </label>

                        <select
                            value={searchType}
                            onChange={(e) => {

                                setSearchType(
                                    e.target.value
                                );

                                setSearchValue("");

                                setError("");
                                setSuccess("");

                            }}
                        >

                            <option value="code">
                                Employee Code
                            </option>

                            <option value="phone">
                                Phone Number
                            </option>

                        </select>

                    </div>


                    {/* SEARCH VALUE */}

                    <div
                        className="field"
                        style={{
                            flex: "1",
                            minWidth: "250px"
                        }}
                    >

                        <label>
                            {searchType === "code"
                                ? "Employee Code"
                                : "Phone Number"
                            }
                        </label>

                        <input
                            type={
                                searchType === "phone"
                                    ? "tel"
                                    : "text"
                            }
                            value={searchValue}
                            onChange={(e) => {

                                const value =
                                    e.target.value;

                                if (
                                    searchType === "phone"
                                ) {

                                    // Only numbers
                                    setSearchValue(
                                        value
                                            .replace(/\D/g, "")
                                            .slice(0, 10)
                                    );

                                } else {

                                    setSearchValue(
                                        value.toUpperCase()
                                    );
                                }

                            }}
                            placeholder={
                                searchType === "code"
                                    ? "Example: FTC12"
                                    : "Example: 9663513263"
                            }
                        />

                    </div>


                    {/* SEARCH */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={searching}
                    >

                        {searching
                            ? "Searching..."
                            : "Search"
                        }

                    </button>


                    {/* CLEAR */}

                    <button
                        type="button"
                        className="btn"
                        onClick={clearSearch}
                    >
                        Clear
                    </button>

                </form>

            </div>


            {/* =================================================
                EMPLOYEE LIST
            ================================================= */}

            <div className="card">

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px"
                    }}
                >

                    <div>

                        <h2>
                            Employee List
                        </h2>

                        <p>
                            {employees.length} employee
                            {employees.length !== 1
                                ? "s"
                                : ""}
                        </p>

                    </div>


                    <button
                        className="btn"
                        onClick={loadEmployees}
                        disabled={loading}
                    >

                        {loading
                            ? "Loading..."
                            : "Refresh"
                        }

                    </button>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <p>
                        Loading employees...
                    </p>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    employees.length === 0 && (

                        <div
                            style={{
                                padding: "30px",
                                textAlign: "center"
                            }}
                        >

                            <h3>
                                No employees found
                            </h3>

                            <p>
                                Create an employee or
                                search using Employee Code
                                or Phone Number.
                            </p>

                        </div>

                    )}


                {/* =================================================
                    TABLE
                ================================================= */}

                {!loading &&
                    employees.length > 0 && (

                        <div
                            style={{
                                overflowX: "auto"
                            }}
                        >

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse"
                                }}
                            >

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Employee Code
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Designation
                                        </th>

                                        <th>
                                            Joining Date
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {employees.map(
                                        (employee) => (

                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        employee.id
                                                    }
                                                </td>


                                                <td>

                                                    <strong>
                                                        {
                                                            employee.employeeCode
                                                        }
                                                    </strong>

                                                </td>


                                                <td>
                                                    {
                                                        employee.name
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        employee.email
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        employee.phone ||
                                                        "-"
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        employee.department
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        employee.designation
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        formatDate(
                                                            employee.joiningDate
                                                        )
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

            </div>

        </div>
    );
}
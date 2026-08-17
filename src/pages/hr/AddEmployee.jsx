import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeApi } from "../../api/endpoints";

export default function AddEmployee() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        joiningDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // =====================================================
    // CREATE EMPLOYEE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            console.log(
                "CREATE EMPLOYEE REQUEST:",
                form
            );

            const response =
                await employeeApi.create(form);

            console.log(
                "EMPLOYEE CREATED:",
                response.data
            );

            alert(
                response.data?.message ||
                "Employee created successfully. Login credentials have been generated."
            );

            navigate("/hr/employees");

        } catch (err) {

            console.error(
                "CREATE EMPLOYEE STATUS:",
                err.response?.status
            );

            console.error(
                "CREATE EMPLOYEE RESPONSE:",
                err.response?.data
            );

            console.error(
                "CREATE EMPLOYEE ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to create employee."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Add Employee
                    </h1>

                    <p>
                        Create a new employee account
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/hr/employees")
                    }
                >
                    ← Back
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* =================================================
                FORM CARD
            ================================================= */}

            <div className="card">

                <h2>
                    Employee Information
                </h2>


                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-grid">


                        {/* =================================================
                            EMPLOYEE NAME
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Employee Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter employee name"
                                required
                            />

                        </div>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Email *
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="employee@company.com"
                                required
                            />

                        </div>


                        {/* =================================================
                            PHONE
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Phone *
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                                maxLength="10"
                                pattern="[0-9]{10}"
                                required
                            />

                        </div>


                        {/* =================================================
                            DEPARTMENT
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Department *
                            </label>

                            <input
                                type="text"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                placeholder="e.g. IT"
                                required
                            />

                        </div>


                        {/* =================================================
                            DESIGNATION
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Designation *
                            </label>

                            <input
                                type="text"
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                placeholder="e.g. Software Engineer"
                                required
                            />

                        </div>


                        {/* =================================================
                            JOINING DATE
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Joining Date *
                            </label>

                            <input
                                type="date"
                                name="joiningDate"
                                value={form.joiningDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* =================================================
                        AUTOMATIC CREDENTIAL INFORMATION
                    ================================================= */}

                    <div className="generated-info">

                        <div className="generated-icon">
                            🔐
                        </div>

                        <div>

                            <strong>
                                Login credentials generated automatically
                            </strong>

                            <p>
                                Employee ID and initial password
                                will be generated by the system
                                after creating the employee.
                                The credentials will be sent to
                                the employee's registered email.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/hr/employees"
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating..."
                                : "Create Employee"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
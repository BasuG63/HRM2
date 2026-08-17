import {
    Link,
    Outlet,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function Layout({ role }) {

    const { user, logout } = useAuth();

    const navigate = useNavigate();


    return (

        <div className="app-shell">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="sidebar">

                <div className="brand">
                    HRM System
                </div>

                <div className="role-label">
                    {role}
                </div>


                <nav>

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    <Link
                        to={
                            role === "HR"
                                ? "/hr/dashboard"
                                : "/employee/dashboard"
                        }
                    >
                        Dashboard
                    </Link>


                    {/* =================================================
                        HR MENU
                    ================================================= */}

                    {role === "HR" && (
                        <>

                            <Link to="/hr/employees">
                                Employees
                            </Link>

                            <Link to="/hr/salary-structures">
                                Salary Structures
                            </Link>

                            <Link to="/hr/salary-assignment">
                                Assign Salary
                            </Link>

                            <Link to="/hr/payroll">
                                Payroll
                            </Link>

                            <Link to="/hr/leave-approvals">
                                Leave Approvals
                            </Link>

                            <Link to="/hr/email-logs">
                                Email Logs
                            </Link>

                        </>
                    )}


                    {/* =================================================
                        EMPLOYEE MENU
                    ================================================= */}

                    {role === "EMPLOYEE" && (
                        <>

                            <Link to="/employee/salary">
                                My Salary
                            </Link>

                            <Link to="/employee/payroll">
                                My Payroll
                            </Link>

                            <Link to="/employee/apply-leave">
                                Apply Leave
                            </Link>

                            <Link to="/employee/my-leaves">
                                My Leaves
                            </Link>

                        </>
                    )}

                </nav>


                {/* =====================================================
                    LOGOUT
                ===================================================== */}

                <button
                    className="logout"
                    onClick={() => {

                        logout();

                        navigate("/login");

                    }}
                >
                    Logout
                </button>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="content">

                <header className="topbar">

                    Welcome,{" "}

                    {
                        user?.name ||
                        user?.email ||
                        role
                    }

                </header>


                <Outlet />

            </main>

        </div>

    );

}
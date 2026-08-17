import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// =====================================================
// HR PAGES
// =====================================================

import HrDashboard from "./pages/hr/HrDashboard";
import Employees from "./pages/hr/Employees";
import AddEmployee from "./pages/hr/AddEmployee";
import SalaryStructures from "./pages/hr/SalaryStructures";
import SalaryAssignment from "./pages/hr/SalaryAssignment";
import Payroll from "./pages/hr/Payroll";
import LeaveApprovals from "./pages/hr/LeaveApprovals";
import EmailLogs from "./pages/hr/EmailLogs";

// =====================================================
// EMPLOYEE PAGES
// =====================================================

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MySalary from "./pages/employee/MySalary";
import MyPayroll from "./pages/employee/MyPayroll";
import ApplyLeave from "./pages/employee/ApplyLeave";
import MyLeaves from "./pages/employee/MyLeaves";


export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =================================================
                    HR ROUTES
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["HR"]}
                        />
                    }
                >

                    <Route
                        element={
                            <Layout role="HR" />
                        }
                    >

                        {/* =================================================
                            HR DASHBOARD
                        ================================================= */}

                        <Route
                            path="/hr/dashboard"
                            element={
                                <HrDashboard />
                            }
                        />


                        {/* =================================================
                            EMPLOYEES
                        ================================================= */}

                        <Route
                            path="/hr/employees"
                            element={
                                <Employees />
                            }
                        />


                        {/* =================================================
                            ADD EMPLOYEE
                        ================================================= */}

                        <Route
                            path="/hr/employees/add"
                            element={
                                <AddEmployee />
                            }
                        />


                        {/* =================================================
                            SALARY STRUCTURES
                        ================================================= */}

                        <Route
                            path="/hr/salary-structures"
                            element={
                                <SalaryStructures />
                            }
                        />


                        {/* =================================================
                            SALARY ASSIGNMENT
                        ================================================= */}

                        <Route
                            path="/hr/salary-assignment"
                            element={
                                <SalaryAssignment />
                            }
                        />


                        {/* =================================================
                            PAYROLL
                        ================================================= */}

                        <Route
                            path="/hr/payroll"
                            element={
                                <Payroll />
                            }
                        />


                        {/* =================================================
                            LEAVE APPROVALS
                        ================================================= */}

                        <Route
                            path="/hr/leave-approvals"
                            element={
                                <LeaveApprovals />
                            }
                        />


                        {/* =================================================
                            EMAIL LOGS
                        ================================================= */}

                        <Route
                            path="/hr/email-logs"
                            element={
                                <EmailLogs />
                            }
                        />

                    </Route>

                </Route>


                {/* =================================================
                    EMPLOYEE ROUTES
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["EMPLOYEE"]}
                        />
                    }
                >

                    <Route
                        element={
                            <Layout role="EMPLOYEE" />
                        }
                    >

                        {/* =================================================
                            EMPLOYEE DASHBOARD
                        ================================================= */}

                        <Route
                            path="/employee/dashboard"
                            element={
                                <EmployeeDashboard />
                            }
                        />


                        {/* =================================================
                            MY SALARY
                        ================================================= */}

                        <Route
                            path="/employee/salary"
                            element={
                                <MySalary />
                            }
                        />


                        {/* =================================================
                            MY PAYROLL
                        ================================================= */}

                        <Route
                            path="/employee/payroll"
                            element={
                                <MyPayroll />
                            }
                        />


                        {/* =================================================
                            APPLY LEAVE
                        ================================================= */}

                        <Route
                            path="/employee/apply-leave"
                            element={
                                <ApplyLeave />
                            }
                        />


                        {/* =================================================
                            MY LEAVES
                        ================================================= */}

                        <Route
                            path="/employee/my-leaves"
                            element={
                                <MyLeaves />
                            }
                        />

                    </Route>

                </Route>


                {/* =================================================
                    DEFAULT
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* =================================================
                    404
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}
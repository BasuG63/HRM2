import React, { useEffect, useMemo, useState } from "react";

import {
    employeeApi,
    payrollApi,
    leaveApprovalApi,
    emailLogApi
} from "../../api/endpoints";

import {
    Link
} from "react-router-dom";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";


export default function HrDashboard() {

    // =====================================================
    // STATE
    // =====================================================

    const [employees, setEmployees] = useState([]);

    const [payrolls, setPayrolls] = useState([]);

    const [leaves, setLeaves] = useState([]);

    const [sentEmails, setSentEmails] = useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        setLoading(true);
        setError("");

        let hasError = false;


        // =================================================
        // EMPLOYEES
        // =================================================

        try {

            const response =
                await employeeApi.getAll();

            console.log(
                "HR EMPLOYEES:",
                response.data
            );

            setEmployees(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "HR EMPLOYEES ERROR:",
                err.response?.data || err.message
            );

            hasError = true;

        }


        // =================================================
        // PAYROLL
        // =================================================

        try {

            const response =
                await payrollApi.getAll();

            console.log(
                "HR PAYROLL:",
                response.data
            );

            setPayrolls(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "HR PAYROLL ERROR:",
                err.response?.data || err.message
            );

            hasError = true;

        }


        // =================================================
        // LEAVE APPLICATIONS
        // =================================================

        try {

            const response =
                await leaveApprovalApi.getAll();

            console.log(
                "HR LEAVES:",
                response.data
            );

            setLeaves(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "HR LEAVE ERROR:",
                err.response?.data || err.message
            );

            hasError = true;

        }


        // =================================================
        // EMAILS
        // =================================================

        try {

            const response =
                await emailLogApi.getSentCount();

            console.log(
                "HR SENT EMAILS:",
                response.data
            );

            const value =
                typeof response.data === "number"
                    ? response.data
                    : response.data?.count ??
                      response.data?.total ??
                      0;

            setSentEmails(value);

        } catch (err) {

            console.error(
                "HR EMAIL ERROR:",
                err.response?.data || err.message
            );

            hasError = true;

        }


        if (hasError) {

            setError(
                "Some dashboard information could not be loaded."
            );

        }

        setLoading(false);

    };


    // =====================================================
    // LEAVE STATISTICS
    // =====================================================

    const pendingLeaves =
        useMemo(
            () =>
                leaves.filter(
                    leave =>
                        leave.status?.toUpperCase() ===
                        "PENDING"
                ).length,
            [leaves]
        );


    const approvedLeaves =
        useMemo(
            () =>
                leaves.filter(
                    leave =>
                        leave.status?.toUpperCase() ===
                        "APPROVED"
                ).length,
            [leaves]
        );


    const rejectedLeaves =
        useMemo(
            () =>
                leaves.filter(
                    leave =>
                        leave.status?.toUpperCase() ===
                        "REJECTED"
                ).length,
            [leaves]
        );


    // =====================================================
    // TOTAL PAYROLL
    // =====================================================

    const totalGrossSalary =
        useMemo(() => {

            return payrolls.reduce(
                (total, payroll) => {

                    return total +
                        Number(
                            payroll.grossSalary ??
                            payroll.gross ??
                            0
                        );

                },
                0
            );

        }, [payrolls]);


    const totalNetSalary =
        useMemo(() => {

            return payrolls.reduce(
                (total, payroll) => {

                    return total +
                        Number(
                            payroll.netSalary ??
                            payroll.netPay ??
                            0
                        );

                },
                0
            );

        }, [payrolls]);


    // =====================================================
    // DEPARTMENT DATA
    // =====================================================

    const departmentData =
        useMemo(() => {

            const map = {};

            employees.forEach(
                employee => {

                    const department =
                        employee.department ||
                        "Other";

                    map[department] =
                        (map[department] || 0) + 1;

                }
            );

            return Object.entries(map)
                .map(
                    ([name, value]) => ({
                        name,
                        value
                    })
                );

        }, [employees]);


    // =====================================================
    // PAYROLL MONTH DATA
    // =====================================================

    const payrollMonthData =
        useMemo(() => {

            const map = {};

            payrolls.forEach(
                payroll => {

                    const year =
                        payroll.year ??
                        payroll.payYear;

                    const month =
                        payroll.month ??
                        payroll.payMonth;

                    if (!year || !month) {
                        return;
                    }

                    const key =
                        `${year}-${String(month).padStart(2, "0")}`;

                    map[key] =
                        (map[key] || 0) +
                        Number(
                            payroll.grossSalary ??
                            0
                        );

                }
            );


            return Object.entries(map)
                .sort(
                    ([a], [b]) =>
                        a.localeCompare(b)
                )
                .slice(-6)
                .map(
                    ([month, amount]) => ({
                        month,
                        amount
                    })
                );

        }, [payrolls]);


    // =====================================================
    // LEAVE CHART
    // =====================================================

    const leaveChartData = [

        {
            name: "Pending",
            value: pendingLeaves
        },

        {
            name: "Approved",
            value: approvedLeaves
        },

        {
            name: "Rejected",
            value: rejectedLeaves
        }

    ];


    // =====================================================
    // MONEY FORMAT
    // =====================================================

    const formatMoney = (value) => {

        if (
            value === null ||
            value === undefined ||
            Number.isNaN(Number(value))
        ) {

            return "₹0";

        }

        return `₹${Number(value).toLocaleString("en-IN")}`;

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page">

                <div className="dashboard-loading">

                    <div className="spinner"></div>

                    <p>
                        Loading HR dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="page hr-dashboard">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-head">

                <div>

                    <div className="dashboard-badge">
                        HR PORTAL
                    </div>

                    <h1>
                        HR Dashboard
                    </h1>

                    <p>
                        Overview of employees, payroll,
                        leaves and HR activities.
                    </p>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={loadDashboard}
                >
                    Refresh
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
                STATISTICS
            ================================================= */}

            <div className="dashboard-grid">


                {/* EMPLOYEES */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        👥
                    </div>

                    <span>
                        Total Employees
                    </span>

                    <strong>
                        {employees.length}
                    </strong>

                    <small>
                        Active employees
                    </small>

                </div>


                {/* GROSS PAYROLL */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        💰
                    </div>

                    <span>
                        Total Gross Payroll
                    </span>

                    <strong>
                        {formatMoney(
                            totalGrossSalary
                        )}
                    </strong>

                    <small>
                        Current payroll records
                    </small>

                </div>


                {/* PENDING LEAVES */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        🏖️
                    </div>

                    <span>
                        Pending Leaves
                    </span>

                    <strong>
                        {pendingLeaves}
                    </strong>

                    <small>
                        Awaiting approval
                    </small>

                </div>


                {/* EMAILS */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        📧
                    </div>

                    <span>
                        Emails Sent
                    </span>

                    <strong>
                        {sentEmails}
                    </strong>

                    <small>
                        Email delivery count
                    </small>

                </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="dashboard-actions">


                <Link
                    to="/hr/employees"
                    className="dashboard-action primary"
                >

                    <span>
                        👥
                    </span>

                    <div>

                        <strong>
                            Employees
                        </strong>

                        <small>
                            Manage employees
                        </small>

                    </div>

                </Link>


                <Link
                    to="/hr/salary-assignment"
                    className="dashboard-action"
                >

                    <span>
                        💰
                    </span>

                    <div>

                        <strong>
                            Assign Salary
                        </strong>

                        <small>
                            Manage employee salaries
                        </small>

                    </div>

                </Link>


                <Link
                    to="/hr/payroll"
                    className="dashboard-action"
                >

                    <span>
                        📄
                    </span>

                    <div>

                        <strong>
                            Payroll
                        </strong>

                        <small>
                            View payroll records
                        </small>

                    </div>

                </Link>


                <Link
                    to="/hr/leave-approvals"
                    className="dashboard-action"
                >

                    <span>
                        📅
                    </span>

                    <div>

                        <strong>
                            Leave Approvals
                        </strong>

                        <small>
                            Review leave requests
                        </small>

                    </div>

                </Link>

            </div>


            {/* =================================================
                CHARTS
            ================================================= */}

            <div className="hr-chart-grid">


                {/* DEPARTMENT CHART */}

                <div className="card chart-card">

                    <div className="card-heading">

                        <div>

                            <h2>
                                Employees by Department
                            </h2>

                            <p>
                                Employee distribution
                            </p>

                        </div>

                    </div>


                    {departmentData.length === 0 ? (

                        <div className="empty-dashboard">
                            No employee data available.
                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >

                            <BarChart
                                data={departmentData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="value"
                                    name="Employees"
                                    fill="#1f4e79"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    )}

                </div>


                {/* LEAVE CHART */}

                <div className="card chart-card">

                    <div className="card-heading">

                        <div>

                            <h2>
                                Leave Applications
                            </h2>

                            <p>
                                Current leave status
                            </p>

                        </div>

                    </div>


                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <PieChart>

                            <Pie
                                data={leaveChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                outerRadius={95}
                                label
                            >

                                <Cell fill="#f59e0b" />

                                <Cell fill="#22c55e" />

                                <Cell fill="#ef4444" />

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>


                {/* PAYROLL CHART */}

                <div className="card chart-card full-chart">

                    <div className="card-heading">

                        <div>

                            <h2>
                                Monthly Payroll
                            </h2>

                            <p>
                                Gross payroll by month
                            </p>

                        </div>

                    </div>


                    {payrollMonthData.length === 0 ? (

                        <div className="empty-dashboard">
                            No payroll data available.
                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >

                            <BarChart
                                data={payrollMonthData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="month"
                                />

                                <YAxis />

                                <Tooltip
                                    formatter={(value) =>
                                        formatMoney(value)
                                    }
                                />

                                <Bar
                                    dataKey="amount"
                                    name="Gross Payroll"
                                    fill="#2563eb"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    )}

                </div>

            </div>


            {/* =================================================
                LEAVE SUMMARY
            ================================================= */}

            <div className="card">


                <div className="card-heading">

                    <div>

                        <h2>
                            Leave Summary
                        </h2>

                        <p>
                            Current employee leave requests
                        </p>

                    </div>

                    <Link
                        to="/hr/leave-approvals"
                        className="view-all-link"
                    >
                        View All
                    </Link>

                </div>


                <div className="dashboard-grid compact">


                    <div className="info-card">

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pendingLeaves}
                        </strong>

                    </div>


                    <div className="info-card">

                        <span>
                            Approved
                        </span>

                        <strong>
                            {approvedLeaves}
                        </strong>

                    </div>


                    <div className="info-card">

                        <span>
                            Rejected
                        </span>

                        <strong>
                            {rejectedLeaves}
                        </strong>

                    </div>


                    <div className="info-card">

                        <span>
                            Total Applications
                        </span>

                        <strong>
                            {leaves.length}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                RECENT EMPLOYEES
            ================================================= */}

            <div className="card">

                <div className="card-heading">

                    <div>

                        <h2>
                            Recent Employees
                        </h2>

                        <p>
                            Recently available employee records.
                        </p>

                    </div>

                    <Link
                        to="/hr/employees"
                        className="view-all-link"
                    >
                        View All
                    </Link>

                </div>


                {employees.length === 0 ? (

                    <div className="empty-dashboard">
                        No employees found.
                    </div>

                ) : (

                    <div className="table-wrap">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Employee Code
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Designation
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {employees
                                    .slice(0, 5)
                                    .map(
                                        employee => (

                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        employee.employeeCode ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.name ||
                                                        employee.employeeName ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.department ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.designation ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        employee.email ||
                                                        "—"
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
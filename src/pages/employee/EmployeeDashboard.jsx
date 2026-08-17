import React, { useEffect, useState } from "react";

import {
    leaveApi,
    employeePayrollApi
} from "../../api/endpoints";

import { Link } from "react-router-dom";
export default function EmployeeDashboard() {

    // =====================================================
    // STATE
    // =====================================================

    const [salary, setSalary] = useState(null);
    const [netSalary, setNetSalary] = useState(null);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [leaves, setLeaves] = useState([]);

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


        // =====================================================
        // 1. LOAD LEAVE BALANCE
        // =====================================================

        try {

            const response =
                await leaveApi.balance();

            console.log(
                "LEAVE BALANCE:",
                response.data
            );

            setLeaveBalance(
                response.data
            );

        } catch (err) {

            console.error(
                "LEAVE BALANCE ERROR:",
                err.response?.data || err.message
            );

            hasError = true;

        }

// =====================================================
// 2. LOAD MY PAYROLL
// =====================================================

try {

    const response =
        await employeePayrollApi.getMyPayroll();

    console.log(
        "MY PAYROLL:",
        response.data
    );

    // Backend returns:
    // List<PayrollResponse>
    //
    // Example:
    // [
    //   {
    //      year: 2026,
    //      month: 8,
    //      grossSalary: 35000,
    //      netSalary: 32400
    //   }
    // ]

    const payrollList =
        Array.isArray(response.data)
            ? response.data
            : [];

    console.log(
        "PAYROLL LIST:",
        payrollList
    );


    // =================================================
    // GET LATEST PAYROLL
    // =================================================

    const payroll =
        payrollList.length > 0
            ? payrollList[0]
            : null;

    console.log(
        "LATEST PAYROLL:",
        payroll
    );


    // =================================================
    // SET SALARY
    // =================================================

    if (payroll) {

        setSalary(
            payroll.grossSalary ??
            payroll.gross ??
            payroll.basicSalary ??
            payroll.salary ??
            payroll.totalSalary ??
            null
        );


        // =================================================
        // SET NET SALARY
        // =================================================

        setNetSalary(
            payroll.netSalary ??
            payroll.netPay ??
            payroll.netAmount ??
            payroll.takeHome ??
            payroll.takeHomeSalary ??
            null
        );

    } else {

        setSalary(null);

        setNetSalary(null);

    }


} catch (err) {

    console.error(
        "MY PAYROLL ERROR:",
        err.response?.data || err.message
    );

    setSalary(null);

    setNetSalary(null);

    hasError = true;

}

        // =====================================================
        // 3. LOAD MY LEAVES
        // =====================================================

        try {

            const response =
                await leaveApi.mine();

            console.log(
                "MY LEAVES:",
                response.data
            );


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setLeaves(data);

        } catch (err) {

            console.error(
                "MY LEAVES ERROR:",
                err.response?.data || err.message
            );

            hasError = true;

        }


        // =====================================================
        // ERROR MESSAGE
        // =====================================================

        if (hasError) {

            setError(
                "Some dashboard information could not be loaded. Please check the failed API in the browser console."
            );

        }


        setLoading(false);
    };


    // =====================================================
    // GET LEAVE BALANCE
    // =====================================================

    const getLeaveBalance = () => {

        if (!leaveBalance) {
            return "—";
        }


        // ---------------------------------------------
        // available
        // ---------------------------------------------

        if (
            leaveBalance.available !== undefined &&
            leaveBalance.available !== null
        ) {

            return leaveBalance.available;

        }


        // ---------------------------------------------
        // remaining
        // ---------------------------------------------

        if (
            leaveBalance.remaining !== undefined &&
            leaveBalance.remaining !== null
        ) {

            return leaveBalance.remaining;

        }


        // ---------------------------------------------
        // total
        // ---------------------------------------------

        if (
            leaveBalance.total !== undefined &&
            leaveBalance.total !== null
        ) {

            return leaveBalance.total;

        }


        // ---------------------------------------------
        // totalBalance
        // ---------------------------------------------

        if (
            leaveBalance.totalBalance !== undefined &&
            leaveBalance.totalBalance !== null
        ) {

            return leaveBalance.totalBalance;

        }


        // ---------------------------------------------
        // CL / SL / EL
        // ---------------------------------------------

        const cl =
            Number(
                leaveBalance.CL ??
                leaveBalance.cl ??
                leaveBalance.casualLeave ??
                0
            );


        const sl =
            Number(
                leaveBalance.SL ??
                leaveBalance.sl ??
                leaveBalance.sickLeave ??
                0
            );


        const el =
            Number(
                leaveBalance.EL ??
                leaveBalance.el ??
                leaveBalance.earnedLeave ??
                0
            );


        if (cl || sl || el) {

            return cl + sl + el;

        }


        return "—";
    };


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "—";

        }


        const number =
            Number(value);


        if (Number.isNaN(number)) {

            return value;

        }


        return `₹${number.toLocaleString("en-IN")}`;
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }


        // If backend returns yyyy-MM-dd
        if (
            typeof date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {

            const [
                year,
                month,
                day
            ] = date.split("-");

            return `${day}/${month}/${year}`;
        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return date;

        }


        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        if (!status) {
            return "";
        }


        return status
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-");
    };


    // =====================================================
    // LEAVE TYPE LABEL
    // =====================================================

    const getLeaveType = (type) => {

        if (!type) {
            return "—";
        }


        const value =
            type.toString().toUpperCase();


        if (value === "CL") {
            return "CL";
        }

        if (value === "SL") {
            return "SL";
        }

        if (value === "EL") {
            return "EL";
        }


        return type;
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
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="page employee-dashboard">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-head">

                <div>

                    <div className="dashboard-badge">
                        Employee Portal
                    </div>

                    <h1>
                        Employee Dashboard
                    </h1>

                    <p>
                        Welcome to your employee portal.
                    </p>

                </div>

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
                DASHBOARD STAT CARDS
            ================================================= */}

            <div className="dashboard-grid">


                {/* =================================================
                    MY SALARY
                ================================================= */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        💰
                    </div>

                    <span>
                        My Salary
                    </span>

                    <strong>
                        {formatMoney(salary)}
                    </strong>

                    <small>
                        Gross salary
                    </small>

                </div>


                {/* =================================================
                    NET SALARY
                ================================================= */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        💳
                    </div>

                    <span>
                        Net Salary
                    </span>

                    <strong>
                        {formatMoney(netSalary)}
                    </strong>

                    <small>
                        Monthly take-home
                    </small>

                </div>


                {/* =================================================
                    LEAVE BALANCE
                ================================================= */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        🏖️
                    </div>

                    <span>
                        Leave Balance
                    </span>

                    <strong>
                        {getLeaveBalance()}
                    </strong>

                    <small>
                        Available leave days
                    </small>

                </div>


                {/* =================================================
                    TOTAL LEAVE APPLICATIONS
                ================================================= */}

                <div className="stat-card employee-stat">

                    <div className="stat-icon">
                        📋
                    </div>

                    <span>
                        Leave Applications
                    </span>

                    <strong>
                        {leaves.length}
                    </strong>

                    <small>
                        Total applications
                    </small>

                </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="dashboard-actions">


                {/* APPLY LEAVE */}

                <Link
                    to="/employee/leave"
                    className="dashboard-action primary"
                >

                    <span>
                        📅
                    </span>

                    <div>

                        <strong>
                            Apply Leave
                        </strong>

                        <small>
                            Submit a new leave request
                        </small>

                    </div>

                </Link>


                {/* MY LEAVES */}

                <Link
                    to="/employee/my-leaves"
                    className="dashboard-action"
                >

                    <span>
                        📋
                    </span>

                    <div>

                        <strong>
                            My Leaves
                        </strong>

                        <small>
                            View leave applications
                        </small>

                    </div>

                </Link>


                {/* MY SALARY */}

                <Link
                    to="/employee/salary"
                    className="dashboard-action"
                >

                    <span>
                        💰
                    </span>

                    <div>

                        <strong>
                            My Salary
                        </strong>

                        <small>
                            View salary details
                        </small>

                    </div>

                </Link>


                {/* MY PAYROLL */}

                <Link
                    to="/employee/payroll"
                    className="dashboard-action"
                >

                    <span>
                        📄
                    </span>

                    <div>

                        <strong>
                            My Payroll
                        </strong>

                        <small>
                            View payroll records
                        </small>

                    </div>

                </Link>

            </div>


            {/* =================================================
                RECENT LEAVE APPLICATIONS
            ================================================= */}

            <div className="card">


                <div className="card-heading">

                    <div>

                        <h2>
                            Recent Leave Applications
                        </h2>

                        <p>
                            Your latest leave requests.
                        </p>

                    </div>


                    <Link
                        to="/employee/my-leaves"
                        className="view-all-link"
                    >
                        View All
                    </Link>

                </div>


                {/* =================================================
                    NO LEAVES
                ================================================= */}

                {leaves.length === 0 ? (

                    <div className="empty-dashboard">

                        <div className="empty-icon">
                            📅
                        </div>

                        <p>
                            No leave applications found.
                        </p>

                        <Link
                            to="/employee/leave"
                            className="btn btn-primary"
                        >
                            Apply Leave
                        </Link>

                    </div>

                ) : (

                    <div className="table-wrap">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Leave Type
                                    </th>

                                    <th>
                                        Start Date
                                    </th>

                                    <th>
                                        End Date
                                    </th>

                                    <th>
                                        Days
                                    </th>

                                    <th>
                                        Reason
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {leaves
                                    .slice(0, 5)
                                    .map((leave) => (

                                    <tr
                                        key={leave.id}
                                    >

                                        <td>

                                            <span className="leave-type">

                                                {getLeaveType(
                                                    leave.leaveType
                                                )}

                                            </span>

                                        </td>


                                        <td>

                                            {formatDate(
                                                leave.startDate
                                            )}

                                        </td>


                                        <td>

                                            {formatDate(
                                                leave.endDate
                                            )}

                                        </td>


                                        <td>

                                            {leave.numberOfDays ??
                                             leave.days ??
                                             "—"}

                                        </td>


                                        <td>

                                            {leave.reason ||
                                             "—"}

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    `status-badge ${
                                                        getStatusClass(
                                                            leave.status
                                                        )
                                                    }`
                                                }
                                            >

                                                {leave.status ||
                                                 "—"}

                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}
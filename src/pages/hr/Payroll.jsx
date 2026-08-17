import React, { useState } from "react";

import {
    employeeApi,
    employeeSalaryApi,
    payrollApi
} from "../../api/endpoints";


export default function Payroll() {

    // =====================================================
    // SEARCH
    // =====================================================

    const [employeeCode, setEmployeeCode] =
        useState("");

    const [employee, setEmployee] =
        useState(null);

    const [salary, setSalary] =
        useState(null);


    // =====================================================
    // PAYROLL PERIOD
    // =====================================================

    const today = new Date();

    const [year, setYear] =
        useState(today.getFullYear());

    const [month, setMonth] =
        useState(today.getMonth() + 1);


    // =====================================================
    // STATES
    // =====================================================

    const [searching, setSearching] =
        useState(false);

    const [loadingSalary, setLoadingSalary] =
        useState(false);

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // PROCESSED PAYROLL
    // =====================================================

    const [processedPayroll, setProcessedPayroll] =
        useState(null);

    const [showDownloadModal, setShowDownloadModal] =
        useState(false);


    // =====================================================
    // SEARCH EMPLOYEE
    // =====================================================

    const handleSearch = async () => {

        const code =
            employeeCode.trim();

        if (!code) {

            setError(
                "Please enter Employee ID."
            );

            return;
        }


        try {

            setSearching(true);

            setError("");
            setSuccess("");

            setEmployee(null);
            setSalary(null);


            const response =
                await employeeApi.searchByCode(
                    code
                );


            let data =
                response.data;


            /*
             * Backend may return:
             *
             * 1. Employee object
             * 2. Array of employees
             */

            if (Array.isArray(data)) {

                if (data.length === 0) {

                    throw new Error(
                        "Employee not found."
                    );
                }

                data = data[0];
            }


            if (!data) {

                throw new Error(
                    "Employee not found."
                );
            }


            setEmployee(data);


            // =================================================
            // LOAD SALARY
            // =================================================

            await loadSalary(data.id);

        } catch (err) {

            console.error(
                "EMPLOYEE SEARCH ERROR:",
                err
            );

            setEmployee(null);
            setSalary(null);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Employee not found."
            );

        } finally {

            setSearching(false);
        }
    };


    // =====================================================
    // ENTER KEY SEARCH
    // =====================================================

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            handleSearch();
        }
    };


    // =====================================================
    // LOAD SALARY
    // =====================================================

    const loadSalary = async (employeeId) => {

        try {

            setLoadingSalary(true);

            const response =
                await employeeSalaryApi.getCurrent(
                    employeeId
                );

            setSalary(response.data);

        } catch (err) {

            console.error(
                "SALARY ERROR:",
                err
            );

            setSalary(null);

        } finally {

            setLoadingSalary(false);
        }
    };


    // =====================================================
    // PROCESS PAYROLL
    // =====================================================

    const handleProcessPayroll = async () => {

        if (!employee) {

            setError(
                "Please search an employee first."
            );

            return;
        }


        if (!salary) {

            setError(
                "Salary is not assigned to this employee."
            );

            return;
        }


        try {

            setProcessing(true);

            setError("");
            setSuccess("");


            // =================================================
            // PROCESS
            // =================================================

            const response =
                await payrollApi.processPayroll({

                    employeeId:
                        employee.id,

                    year:
                        Number(year),

                    month:
                        Number(month)

                });


            const payroll =
                response.data;


            console.log(
                "PAYROLL RESPONSE:",
                payroll
            );


            const payrollId =
                payroll?.id ??
                payroll?.payrollId;


            if (!payrollId) {

                throw new Error(
                    "Payroll processed but payroll ID was not returned."
                );
            }


            // =================================================
            // AUTOMATIC EMAIL
            // =================================================

            try {

                await payrollApi.sendPayslipEmail(
                    payrollId
                );


                console.log(
                    "PAYSLIP EMAIL SENT"
                );


                setSuccess(
                    "Payroll processed and payslip sent successfully."
                );

            } catch (emailError) {

                console.error(
                    "EMAIL ERROR:",
                    emailError
                );


                setSuccess(
                    "Payroll processed successfully, but email could not be sent."
                );
            }


            // =================================================
            // SAVE PROCESSED PAYROLL
            // =================================================

            setProcessedPayroll({

                ...payroll,

                id:
                    payrollId

            });


            // =================================================
            // SHOW DOWNLOAD MODAL
            // =================================================

            setShowDownloadModal(
                true
            );


        } catch (err) {

            console.error(
                "PAYROLL PROCESS ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Unable to process payroll."
            );

        } finally {

            setProcessing(false);
        }
    };


    // =====================================================
    // DOWNLOAD PDF
    // =====================================================

    const handleDownloadPDF = async () => {

        if (!processedPayroll?.id) {

            setError(
                "Payroll ID not available."
            );

            return;
        }


        try {

            const response =
                await payrollApi.downloadPayslip(
                    processedPayroll.id
                );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type:
                            "application/pdf"
                    }
                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href =
                url;


            link.download =
                `Payslip-${employee?.employeeCode}-${month}-${year}.pdf`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            setShowDownloadModal(
                false
            );


        } catch (err) {

            console.error(
                "PDF DOWNLOAD ERROR:",
                err
            );


            setError(
                "Unable to download payslip."
            );
        }
    };


    // =====================================================
    // MONEY
    // =====================================================

    const money = (value) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN"
        );
    };


    // =====================================================
    // MONTH NAME
    // =====================================================

    const monthName =
        new Date(
            year,
            month - 1
        ).toLocaleString(
            "en-IN",
            {
                month:
                    "long"
            }
        );


    // =====================================================
    // RESET
    // =====================================================

    const reset = () => {

        setEmployeeCode("");

        setEmployee(null);

        setSalary(null);

        setError("");

        setSuccess("");

        setProcessedPayroll(null);
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="page payroll-page">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="page-head">

                <div>

                    <div className="eyebrow">
                        HR MANAGEMENT
                    </div>

                    <h1>
                        Payroll Processing
                    </h1>

                    <p>
                        Search an employee and process monthly payroll.
                    </p>

                </div>

            </div>


            {/* ================================================= */}
            {/* ALERTS */}
            {/* ================================================= */}

            {error && (

                <div className="alert error">
                    {error}
                </div>

            )}


            {success && (

                <div className="alert success">
                    {success}
                </div>

            )}


            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <div className="payroll-search-card">

                <div className="search-title">

                    <div className="search-icon">
                        🔎
                    </div>

                    <div>

                        <h2>
                            Find Employee
                        </h2>

                        <p>
                            Enter the employee ID to continue.
                        </p>

                    </div>

                </div>


                <div className="employee-search">

                    <input
                        type="text"
                        value={employeeCode}
                        onChange={(e) =>
                            setEmployeeCode(
                                e.target.value
                            )
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        placeholder="Enter Employee ID e.g. FTC13"
                        autoFocus
                    />


                    <button
                        className="btn btn-primary search-btn"
                        onClick={
                            handleSearch
                        }
                        disabled={
                            searching
                        }
                    >

                        {searching
                            ? "Searching..."
                            : "Search"
                        }

                    </button>

                </div>


                <small className="search-hint">
                    Press Enter to search
                </small>

            </div>


            {/* ================================================= */}
            {/* EMPLOYEE SUMMARY */}
            {/* ================================================= */}

            {employee && (

                <div className="employee-summary-card">


                    {/* ------------------------------------------------- */}
                    {/* TOP */}
                    {/* ------------------------------------------------- */}

                    <div className="employee-summary-header">

                        <div className="employee-profile">

                            <div className="large-avatar">

                                {employee.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                            </div>


                            <div>

                                <h2>
                                    {employee.name}
                                </h2>

                                <span>
                                    {employee.employeeCode}
                                </span>

                            </div>

                        </div>


                        <button
                            className="btn-clear"
                            onClick={
                                reset
                            }
                        >
                            Change Employee
                        </button>

                    </div>


                    {/* ------------------------------------------------- */}
                    {/* EMPLOYEE INFORMATION */}
                    {/* ------------------------------------------------- */}

                    <div className="employee-info-grid">

                        <div>

                            <span>
                                Department
                            </span>

                            <strong>
                                {employee.department ||
                                    "—"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Designation
                            </span>

                            <strong>
                                {employee.designation ||
                                    "—"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {employee.email ||
                                    "—"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {employee.phone ||
                                    "—"}
                            </strong>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* SALARY SUMMARY */}
                    {/* ================================================= */}

                    <div className="summary-section">

                        <div className="section-title">

                            <h3>
                                Salary Summary
                            </h3>

                        </div>


                        {loadingSalary ? (

                            <div className="summary-loading">
                                Loading salary...
                            </div>

                        ) : !salary ? (

                            <div className="alert error">

                                No active salary assignment
                                found for this employee.

                            </div>

                        ) : (

                            <div className="salary-summary-grid">

                                <div>

                                    <span>
                                        Basic Salary
                                    </span>

                                    <strong>
                                        ₹
                                        {money(
                                            salary.basicSalary
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        HRA
                                    </span>

                                    <strong>
                                        ₹
                                        {money(
                                            salary.hra
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Special Allowance
                                    </span>

                                    <strong>
                                        ₹
                                        {money(
                                            salary.specialAllowance
                                        )}
                                    </strong>

                                </div>


                                <div className="gross-box">

                                    <span>
                                        Gross Salary
                                    </span>

                                    <strong>
                                        ₹
                                        {money(
                                            salary.grossSalary
                                        )}
                                    </strong>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* ================================================= */}
                    {/* PAYROLL PERIOD */}
                    {/* ================================================= */}

                    <div className="summary-section">

                        <div className="section-title">

                            <h3>
                                Payroll Period
                            </h3>

                        </div>


                        <div className="period-row">

                            <div className="period-field">

                                <label>
                                    Year
                                </label>

                                <select
                                    value={year}
                                    onChange={(e) =>
                                        setYear(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                >

                                    {[2025, 2026, 2027, 2028]
                                        .map(y => (

                                            <option
                                                key={y}
                                                value={y}
                                            >
                                                {y}
                                            </option>

                                        ))}

                                </select>

                            </div>


                            <div className="period-field">

                                <label>
                                    Month
                                </label>

                                <select
                                    value={month}
                                    onChange={(e) =>
                                        setMonth(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                >

                                    {Array.from(
                                        {
                                            length:
                                                12
                                        },
                                        (_, i) =>
                                            i + 1
                                    ).map(m => (

                                        <option
                                            key={m}
                                            value={m}
                                        >

                                            {new Date(
                                                2000,
                                                m - 1
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    month:
                                                        "long"
                                                }
                                            )}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            <div className="period-display">

                                <span>
                                    Processing
                                </span>

                                <strong>
                                    {monthName} {year}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* PROCESS */}
                    {/* ================================================= */}

                    <div className="process-footer">

                        <div>

                            {salary ? (

                                <>

                                    <span className="ready-dot">
                                        ●
                                    </span>

                                    Ready to process payroll

                                </>

                            ) : (

                                <>

                                    <span className="not-ready-dot">
                                        ●
                                    </span>

                                    Salary assignment required

                                </>

                            )}

                        </div>


                        <button
                            className="process-button"
                            onClick={
                                handleProcessPayroll
                            }
                            disabled={
                                processing ||
                                loadingSalary ||
                                !salary
                            }
                        >

                            {processing
                                ? "Processing..."
                                : "Process Payroll →"
                            }

                        </button>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {!employee && !searching && (

                <div className="payroll-empty">

                    <div className="empty-search-icon">
                        🔎
                    </div>

                    <h3>
                        Search an employee to begin
                    </h3>

                    <p>
                        Enter an Employee ID above and press
                        Enter or Search.
                    </p>

                </div>

            )}


            {/* ================================================= */}
            {/* DOWNLOAD MODAL */}
            {/* ================================================= */}

            {showDownloadModal && (

                <div className="modal-overlay">

                    <div className="download-modal">

                        <div className="success-circle">
                            ✓
                        </div>


                        <h2>
                            Payroll Processed
                        </h2>


                        <p>
                            Payroll for{" "}
                            <strong>
                                {employee?.name}
                            </strong>{" "}
                            has been processed successfully.
                        </p>


                        <div className="email-confirmation">

                            ✓ Payslip sent to

                            <strong>
                                {employee?.email ||
                                    "employee email"}
                            </strong>

                        </div>


                        <p className="download-question">
                            Would you like to download
                            the payslip PDF?
                        </p>


                        <div className="modal-actions">

                            <button
                                className="btn btn-primary"
                                onClick={
                                    handleDownloadPDF
                                }
                            >
                                Download PDF
                            </button>


                            <button
                                className="btn btn-cancel"
                                onClick={() =>
                                    setShowDownloadModal(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
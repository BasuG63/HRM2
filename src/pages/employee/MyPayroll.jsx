import React, {
    useEffect,
    useState
} from "react";

import {
    employeePayrollApi
} from "../../api/endpoints";


export default function MyPayroll() {

    const [payrolls, setPayrolls] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [downloadingId, setDownloadingId] =
        useState(null);


    // =====================================================
    // LOAD PAYROLL HISTORY
    // =====================================================

    useEffect(() => {

        loadPayroll();

    }, []);


    const loadPayroll = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await employeePayrollApi.getMyPayroll();

            console.log(
                "MY PAYROLL:",
                response.data
            );

            setPayrolls(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "MY PAYROLL ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load payroll records."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // FORMAT MONTH
    // =====================================================

    const getMonthName = (month) => {

        const months = [
            "",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        return months[Number(month)] || month;
    };


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (amount) => {

        if (
            amount === null ||
            amount === undefined
        ) {
            return "₹0.00";
        }

        return `₹${Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    // =====================================================
    // DOWNLOAD PAYSLIP
    // =====================================================

    const handleDownloadPayslip = async (
        payroll
    ) => {

        console.log(
            "DOWNLOAD PAYROLL:",
            payroll
        );


        // IMPORTANT
        // Backend PayrollResponse contains:
        //
        // year
        // month
        //
        // NOT:
        //
        // payYear
        // payMonth

        const year = payroll?.year;

        const month = payroll?.month;


        console.log(
            "PAYSLIP YEAR:",
            year
        );

        console.log(
            "PAYSLIP MONTH:",
            month
        );


        // =================================================
        // VALIDATION
        // =================================================

        if (
            year === null ||
            year === undefined ||
            month === null ||
            month === undefined
        ) {

            setError(
                "Payroll year or month is missing."
            );

            console.error(
                "Invalid payroll data:",
                payroll
            );

            return;
        }


        try {

            setDownloadingId(
                payroll.id
            );

            setError("");


            // =================================================
            // CALL BACKEND
            //
            // GET
            // /api/employee/payroll/my/{year}/{month}/pdf
            //
            // Example:
            // /api/employee/payroll/my/2026/8/pdf
            // =================================================

            const response =
                await employeePayrollApi.downloadPayslip(
                    year,
                    month
                );


            console.log(
                "PAYSLIP PDF RESPONSE:",
                response
            );


            // =================================================
            // CREATE PDF BLOB
            // =================================================

            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf"
                    }
                );


            // =================================================
            // CREATE DOWNLOAD URL
            // =================================================

            const url =
                window.URL.createObjectURL(
                    blob
                );


            // =================================================
            // CREATE DOWNLOAD LINK
            // =================================================

            const link =
                document.createElement("a");

            link.href = url;


            link.download =
                `Payslip-${payroll.employeeCode || "Employee"}-${month}-${year}.pdf`;


            document.body.appendChild(link);

            link.click();


            // =================================================
            // CLEANUP
            // =================================================

            link.remove();

            window.URL.revokeObjectURL(
                url
            );

        } catch (err) {

            console.error(
                "PAYSLIP DOWNLOAD ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to download payslip. Please try again."
            );

        } finally {

            setDownloadingId(
                null
            );

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page">

                <div className="payroll-loading">

                    <div className="loading-spinner">
                    </div>

                    <p>
                        Loading payroll records...
                    </p>

                </div>

            </div>

        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-head">

                <div>

                    <span className="page-badge">
                        EMPLOYEE PAYROLL
                    </span>

                    <h1>
                        My Payroll
                    </h1>

                    <p>
                        View your salary history and download payslips.
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
                NO PAYROLL
            ================================================= */}

            {payrolls.length === 0 ? (

                <div className="card empty-state">

                    <div className="empty-icon">
                        📄
                    </div>

                    <h2>
                        No Payroll Records
                    </h2>

                    <p>
                        Your payroll records will appear here
                        once payroll has been generated.
                    </p>

                </div>

            ) : (

                <>


                    {/* =================================================
                        PAYROLL SUMMARY
                    ================================================= */}

                    <div className="dashboard-grid">


                        {/* GROSS */}

                        <div className="stat-card payroll-stat">

                            <div className="stat-icon">
                                💰
                            </div>

                            <span>
                                Latest Gross Salary
                            </span>

                            <strong>
                                {formatMoney(
                                    payrolls[0]?.grossSalary
                                )}
                            </strong>

                            <small>

                                {getMonthName(
                                    payrolls[0]?.month
                                )}

                                {" "}

                                {payrolls[0]?.year}

                            </small>

                        </div>


                        {/* NET */}

                        <div className="stat-card payroll-stat">

                            <div className="stat-icon">
                                💳
                            </div>

                            <span>
                                Latest Net Salary
                            </span>

                            <strong>
                                {formatMoney(
                                    payrolls[0]?.netSalary
                                )}
                            </strong>

                            <small>
                                Monthly take-home
                            </small>

                        </div>


                        {/* RECORDS */}

                        <div className="stat-card payroll-stat">

                            <div className="stat-icon">
                                📊
                            </div>

                            <span>
                                Total Payroll Records
                            </span>

                            <strong>
                                {payrolls.length}
                            </strong>

                            <small>
                                Available records
                            </small>

                        </div>


                        {/* PAYSLIP */}

                        <div className="stat-card payroll-stat">

                            <div className="stat-icon">
                                📄
                            </div>

                            <span>
                                Payslip
                            </span>

                            <strong>
                                PDF
                            </strong>

                            <small>
                                Download available
                            </small>

                        </div>

                    </div>


                    {/* =================================================
                        PAYROLL HISTORY
                    ================================================= */}

                    <div className="card">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Payroll History
                                </h2>

                                <p>
                                    Your monthly salary records
                                </p>

                            </div>

                        </div>


                        <div className="table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Pay Period
                                        </th>

                                        <th>
                                            Basic Salary
                                        </th>

                                        <th>
                                            HRA
                                        </th>

                                        <th>
                                            Gross Salary
                                        </th>

                                        <th>
                                            Deductions
                                        </th>

                                        <th>
                                            Net Salary
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Payslip
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {payrolls.map(
                                        (payroll) => (

                                            <tr
                                                key={
                                                    payroll.id
                                                }
                                            >


                                                {/* PAY PERIOD */}

                                                <td>

                                                    <strong>

                                                        {
                                                            getMonthName(
                                                                payroll.month
                                                            )
                                                        }

                                                    </strong>

                                                    <br />

                                                    <small>

                                                        {
                                                            payroll.year
                                                        }

                                                    </small>

                                                </td>


                                                {/* BASIC */}

                                                <td>

                                                    {
                                                        formatMoney(
                                                            payroll.basicSalary
                                                        )
                                                    }

                                                </td>


                                                {/* HRA */}

                                                <td>

                                                    {
                                                        formatMoney(
                                                            payroll.hra
                                                        )
                                                    }

                                                </td>


                                                {/* GROSS */}

                                                <td>

                                                    <strong>

                                                        {
                                                            formatMoney(
                                                                payroll.grossSalary
                                                            )
                                                        }

                                                    </strong>

                                                </td>


                                                {/* DEDUCTIONS */}

                                                <td>

                                                    {
                                                        formatMoney(
                                                            payroll.totalDeductions
                                                        )
                                                    }

                                                </td>


                                                {/* NET */}

                                                <td>

                                                    <strong>

                                                        {
                                                            formatMoney(
                                                                payroll.netSalary
                                                            )
                                                        }

                                                    </strong>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            `status-badge ${
                                                                (
                                                                    payroll.status ||
                                                                    ""
                                                                ).toLowerCase()
                                                            }`
                                                        }
                                                    >

                                                        {
                                                            payroll.status ||
                                                            "N/A"
                                                        }

                                                    </span>

                                                </td>


                                                {/* DOWNLOAD */}

                                                <td>

                                                    <button
                                                        className="small-btn"
                                                        onClick={() =>
                                                            handleDownloadPayslip(
                                                                payroll
                                                            )
                                                        }
                                                        disabled={
                                                            downloadingId ===
                                                            payroll.id
                                                        }
                                                    >

                                                        {
                                                            downloadingId ===
                                                            payroll.id

                                                                ? "Downloading..."

                                                                : "📥 Download"
                                                        }

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* =================================================
                        LATEST PAYROLL DETAILS
                    ================================================= */}

                    {payrolls[0] && (

                        <div className="card">


                            <div className="section-header">

                                <div>

                                    <h2>
                                        Latest Payroll Details
                                    </h2>

                                    <p>

                                        {
                                            getMonthName(
                                                payrolls[0].month
                                            )
                                        }

                                        {" "}

                                        {
                                            payrolls[0].year
                                        }

                                    </p>

                                </div>


                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        handleDownloadPayslip(
                                            payrolls[0]
                                        )
                                    }
                                    disabled={
                                        downloadingId ===
                                        payrolls[0].id
                                    }
                                >

                                    {
                                        downloadingId ===
                                        payrolls[0].id

                                            ? "Downloading..."

                                            : "📥 Download Payslip"
                                    }

                                </button>

                            </div>


                            {/* DETAILS */}

                            <div className="payroll-details-grid">


                                <div className="detail-item">

                                    <span>
                                        Employee
                                    </span>

                                    <strong>
                                        {
                                            payrolls[0].employeeName ||
                                            "—"
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Employee Code
                                    </span>

                                    <strong>
                                        {
                                            payrolls[0].employeeCode ||
                                            "—"
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Department
                                    </span>

                                    <strong>
                                        {
                                            payrolls[0].department ||
                                            "—"
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Designation
                                    </span>

                                    <strong>
                                        {
                                            payrolls[0].designation ||
                                            "—"
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Basic Salary
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0].basicSalary
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        HRA
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0].hra
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Special Allowance
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0]
                                                    .specialAllowance
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Gross Salary
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0].grossSalary
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        PF
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0].pfAmount
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        ESI
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0].esiAmount
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Professional Tax
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0]
                                                    .professionalTax
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Total Deductions
                                    </span>

                                    <strong>
                                        {
                                            formatMoney(
                                                payrolls[0]
                                                    .totalDeductions
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* =================================================
                                NET PAY
                            ================================================= */}

                            <div className="card net-pay-card">

                                <div>

                                    <span>
                                        NET PAY
                                    </span>

                                    <h2>

                                        {
                                            formatMoney(
                                                payrolls[0]
                                                    .netSalary
                                            )
                                        }

                                    </h2>

                                    <p>
                                        Amount credited for this
                                        payroll period
                                    </p>

                                </div>


                                <div className="net-pay-icon">
                                    💰
                                </div>

                            </div>

                        </div>

                    )}

                </>

            )}

        </div>

    );
}
import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    employeePayrollApi
} from "../../api/endpoints";


export default function MySalary() {

    const [payrolls, setPayrolls] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD SALARY / PAYROLL DATA
    // =====================================================

    useEffect(() => {

        loadSalary();

    }, []);


    const loadSalary = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await employeePayrollApi.getMyPayroll();

            console.log(
                "MY SALARY DATA:",
                response.data
            );

            setPayrolls(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "MY SALARY ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load salary information."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // HELPERS
    // =====================================================

    const money = (value) => {

        if (
            value === null ||
            value === undefined
        ) {
            return "₹0";
        }

        return `₹${Number(value).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )}`;
    };


    const monthName = (month) => {

        const months = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        return months[Number(month)] || month;

    };


    // =====================================================
    // SORT PAYROLL
    // =====================================================

    const sortedPayrolls = useMemo(() => {

        return [...payrolls].sort(
            (a, b) => {

                const dateA =
                    Number(a.year || 0) * 100 +
                    Number(a.month || 0);

                const dateB =
                    Number(b.year || 0) * 100 +
                    Number(b.month || 0);

                return dateA - dateB;

            }
        );

    }, [payrolls]);


    const latest =
        sortedPayrolls[
            sortedPayrolls.length - 1
        ];


    // =====================================================
    // GRAPH MAX VALUE
    // =====================================================

    const graphMax = useMemo(() => {

        if (!sortedPayrolls.length) {
            return 1;
        }

        const values =
            sortedPayrolls.flatMap(
                payroll => [

                    Number(
                        payroll.grossSalary || 0
                    ),

                    Number(
                        payroll.netSalary || 0
                    ),

                    Number(
                        payroll.totalDeductions || 0
                    )

                ]
            );

        return Math.max(
            ...values,
            1
        );

    }, [sortedPayrolls]);


    // =====================================================
    // AVERAGE SALARY
    // =====================================================

    const averageGross = useMemo(() => {

        if (!sortedPayrolls.length) {
            return 0;
        }

        const total =
            sortedPayrolls.reduce(
                (sum, payroll) =>
                    sum +
                    Number(
                        payroll.grossSalary || 0
                    ),
                0
            );

        return total / sortedPayrolls.length;

    }, [sortedPayrolls]);


    const averageNet = useMemo(() => {

        if (!sortedPayrolls.length) {
            return 0;
        }

        const total =
            sortedPayrolls.reduce(
                (sum, payroll) =>
                    sum +
                    Number(
                        payroll.netSalary || 0
                    ),
                0
            );

        return total / sortedPayrolls.length;

    }, [sortedPayrolls]);


    // =====================================================
    // TOTAL DEDUCTIONS
    // =====================================================

    const totalDeductions = useMemo(() => {

        return sortedPayrolls.reduce(
            (sum, payroll) =>
                sum +
                Number(
                    payroll.totalDeductions || 0
                ),
            0
        );

    }, [sortedPayrolls]);


    // =====================================================
    // LEAVE USAGE
    // =====================================================

    const leaveUsage = useMemo(() => {

        if (!latest) {

            return {
                casual: 0,
                sick: 0,
                earned: 0
            };

        }

        return {

            casual:
                Number(
                    latest.casualLeaveUsed || 0
                ),

            sick:
                Number(
                    latest.sickLeaveUsed || 0
                ),

            earned:
                Number(
                    latest.earnedLeaveUsed || 0
                )

        };

    }, [latest]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page">

                <div className="salary-loading">

                    <div className="loading-spinner">
                    </div>

                    <p>
                        Loading salary information...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="page salary-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="salary-page-header">

                <div>

                    <span className="page-badge">
                        EMPLOYEE PORTAL
                    </span>

                    <h1>
                        My Salary
                    </h1>

                    <p>
                        View your salary details, earnings,
                        deductions and salary trends.
                    </p>

                </div>

                {latest && (

                    <div className="salary-period">

                        <span>
                            Latest Payroll
                        </span>

                        <strong>

                            {monthName(
                                latest.month
                            )}

                            {" "}

                            {latest.year}

                        </strong>

                    </div>

                )}

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="alert error">

                    {error}

                </div>

            )}


            {payrolls.length === 0 ? (

                <div className="card empty-state">

                    <div className="empty-icon">
                        💰
                    </div>

                    <h2>
                        Salary Information Not Available
                    </h2>

                    <p>
                        Your salary information will appear
                        here once payroll has been generated.
                    </p>

                </div>

            ) : (

                <>


                    {/* =================================================
                        TOP STATISTICS
                    ================================================= */}

                    <div className="dashboard-grid salary-stats">


                        {/* GROSS */}

                        <div className="salary-stat-card">

                            <div className="salary-stat-icon">
                                💰
                            </div>

                            <span>
                                Latest Gross Salary
                            </span>

                            <strong>
                                {money(
                                    latest.grossSalary
                                )}
                            </strong>

                            <small>
                                Before deductions
                            </small>

                        </div>


                        {/* NET */}

                        <div className="salary-stat-card">

                            <div className="salary-stat-icon">
                                💳
                            </div>

                            <span>
                                Net Salary
                            </span>

                            <strong>
                                {money(
                                    latest.netSalary
                                )}
                            </strong>

                            <small>
                                Monthly take-home
                            </small>

                        </div>


                        {/* DEDUCTIONS */}

                        <div className="salary-stat-card">

                            <div className="salary-stat-icon">
                                📉
                            </div>

                            <span>
                                Total Deductions
                            </span>

                            <strong>
                                {money(
                                    latest.totalDeductions
                                )}
                            </strong>

                            <small>
                                PF + ESI + Tax
                            </small>

                        </div>


                        {/* BASIC */}

                        <div className="salary-stat-card">

                            <div className="salary-stat-icon">
                                🧾
                            </div>

                            <span>
                                Basic Salary
                            </span>

                            <strong>
                                {money(
                                    latest.basicSalary
                                )}
                            </strong>

                            <small>
                                Monthly basic
                            </small>

                        </div>

                    </div>


                    {/* =================================================
                        GRAPHS
                    ================================================= */}

                    <div className="salary-chart-grid">


                        {/* =================================================
                            SALARY TREND
                        ================================================= */}

                        <div className="card salary-chart-card">

                            <div className="chart-header">

                                <div>

                                    <h2>
                                        Salary Trend
                                    </h2>

                                    <p>
                                        Gross vs Net salary
                                    </p>

                                </div>

                                <div className="chart-legend">

                                    <span>
                                        <i className="legend-gross"></i>
                                        Gross
                                    </span>

                                    <span>
                                        <i className="legend-net"></i>
                                        Net
                                    </span>

                                </div>

                            </div>


                            <div className="bar-chart">

                                {sortedPayrolls.map(
                                    (payroll) => {

                                        const gross =
                                            Number(
                                                payroll.grossSalary ||
                                                0
                                            );

                                        const net =
                                            Number(
                                                payroll.netSalary ||
                                                0
                                            );

                                        const grossHeight =
                                            (
                                                gross /
                                                graphMax
                                            ) * 100;

                                        const netHeight =
                                            (
                                                net /
                                                graphMax
                                            ) * 100;


                                        return (

                                            <div
                                                className="bar-group"
                                                key={
                                                    payroll.id
                                                }
                                            >

                                                <div className="bars">

                                                    <div
                                                        className="bar gross-bar"
                                                        style={{
                                                            height:
                                                                `${grossHeight}%`
                                                        }}
                                                        title={
                                                            `Gross: ${money(gross)}`
                                                        }
                                                    >
                                                    </div>

                                                    <div
                                                        className="bar net-bar"
                                                        style={{
                                                            height:
                                                                `${netHeight}%`
                                                        }}
                                                        title={
                                                            `Net: ${money(net)}`
                                                        }
                                                    >
                                                    </div>

                                                </div>

                                                <span>
                                                    {
                                                        monthName(
                                                            payroll.month
                                                        )
                                                    }
                                                </span>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            DEDUCTION GRAPH
                        ================================================= */}

                        <div className="card salary-chart-card">

                            <div className="chart-header">

                                <div>

                                    <h2>
                                        Deductions
                                    </h2>

                                    <p>
                                        Monthly deduction trend
                                    </p>

                                </div>

                            </div>


                            <div className="line-chart">

                                {sortedPayrolls.map(
                                    (payroll) => {

                                        const deduction =
                                            Number(
                                                payroll.totalDeductions ||
                                                0
                                            );

                                        const percentage =
                                            (
                                                deduction /
                                                graphMax
                                            ) * 100;


                                        return (

                                            <div
                                                className="deduction-row"
                                                key={
                                                    payroll.id
                                                }
                                            >

                                                <div className="deduction-label">

                                                    <span>
                                                        {
                                                            monthName(
                                                                payroll.month
                                                            )
                                                        }
                                                    </span>

                                                    <strong>
                                                        {
                                                            money(
                                                                deduction
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="progress-track">

                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width:
                                                                `${percentage}%`
                                                        }}
                                                    >
                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SALARY BREAKDOWN
                    ================================================= */}

                    <div className="salary-bottom-grid">


                        {/* =================================================
                            CURRENT SALARY
                        ================================================= */}

                        <div className="card">

                            <div className="section-header">

                                <div>

                                    <h2>
                                        Current Salary Breakdown
                                    </h2>

                                    <p>
                                        Latest payroll components
                                    </p>

                                </div>

                            </div>


                            <div className="salary-breakdown">


                                <div className="breakdown-row">

                                    <span>
                                        Basic Salary
                                    </span>

                                    <strong>
                                        {money(
                                            latest.basicSalary
                                        )}
                                    </strong>

                                </div>


                                <div className="breakdown-row">

                                    <span>
                                        HRA
                                    </span>

                                    <strong>
                                        {money(
                                            latest.hra
                                        )}
                                    </strong>

                                </div>


                                <div className="breakdown-row">

                                    <span>
                                        Special Allowance
                                    </span>

                                    <strong>
                                        {money(
                                            latest.specialAllowance
                                        )}
                                    </strong>

                                </div>


                                <div className="breakdown-row total-row">

                                    <span>
                                        Gross Salary
                                    </span>

                                    <strong>
                                        {money(
                                            latest.grossSalary
                                        )}
                                    </strong>

                                </div>


                                <div className="breakdown-divider">
                                </div>


                                <div className="breakdown-row deduction">

                                    <span>
                                        PF
                                    </span>

                                    <strong>
                                        - {money(
                                            latest.pfAmount
                                        )}
                                    </strong>

                                </div>


                                <div className="breakdown-row deduction">

                                    <span>
                                        ESI
                                    </span>

                                    <strong>
                                        - {money(
                                            latest.esiAmount
                                        )}
                                    </strong>

                                </div>


                                <div className="breakdown-row deduction">

                                    <span>
                                        Professional Tax
                                    </span>

                                    <strong>
                                        - {money(
                                            latest.professionalTax
                                        )}
                                    </strong>

                                </div>


                                <div className="breakdown-row deduction">

                                    <span>
                                        Total Deductions
                                    </span>

                                    <strong>
                                        - {money(
                                            latest.totalDeductions
                                        )}
                                    </strong>

                                </div>


                                <div className="net-salary-box">

                                    <div>

                                        <span>
                                            NET SALARY
                                        </span>

                                        <strong>
                                            {money(
                                                latest.netSalary
                                            )}
                                        </strong>

                                    </div>

                                    <div className="net-icon">
                                        ₹
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            LEAVE STATISTICS
                        ================================================= */}

                        <div className="card">

                            <div className="section-header">

                                <div>

                                    <h2>
                                        Leave Statistics
                                    </h2>

                                    <p>
                                        Leave usage in latest payroll
                                    </p>

                                </div>

                            </div>


                            <div className="leave-stat-list">


                                <div className="leave-stat">

                                    <div className="leave-stat-top">

                                        <span>
                                            Casual Leave
                                        </span>

                                        <strong>
                                            {
                                                leaveUsage.casual
                                            }
                                        </strong>

                                    </div>

                                    <div className="leave-progress">

                                        <div
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        leaveUsage.casual *
                                                        8.33,
                                                        100
                                                    )}%`
                                            }}
                                        >
                                        </div>

                                    </div>

                                </div>


                                <div className="leave-stat">

                                    <div className="leave-stat-top">

                                        <span>
                                            Sick Leave
                                        </span>

                                        <strong>
                                            {
                                                leaveUsage.sick
                                            }
                                        </strong>

                                    </div>

                                    <div className="leave-progress">

                                        <div
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        leaveUsage.sick *
                                                        8.33,
                                                        100
                                                    )}%`
                                            }}
                                        >
                                        </div>

                                    </div>

                                </div>


                                <div className="leave-stat">

                                    <div className="leave-stat-top">

                                        <span>
                                            Earned Leave
                                        </span>

                                        <strong>
                                            {
                                                leaveUsage.earned
                                            }
                                        </strong>

                                    </div>

                                    <div className="leave-progress">

                                        <div
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        leaveUsage.earned *
                                                        6.66,
                                                        100
                                                    )}%`
                                            }}
                                        >
                                        </div>

                                    </div>

                                </div>

                            </div>


                            <div className="salary-summary-box">

                                <span>
                                    Average Gross Salary
                                </span>

                                <strong>
                                    {money(
                                        averageGross
                                    )}
                                </strong>

                            </div>


                            <div className="salary-summary-box">

                                <span>
                                    Average Net Salary
                                </span>

                                <strong>
                                    {money(
                                        averageNet
                                    )}
                                </strong>

                            </div>


                            <div className="salary-summary-box">

                                <span>
                                    Total Deductions
                                </span>

                                <strong>
                                    {money(
                                        totalDeductions
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PAYROLL HISTORY
                    ================================================= */}

                    <div className="card">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Salary History
                                </h2>

                                <p>
                                    Monthly salary records
                                </p>

                            </div>

                        </div>


                        <div className="table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Period
                                        </th>

                                        <th>
                                            Basic
                                        </th>

                                        <th>
                                            HRA
                                        </th>

                                        <th>
                                            Gross
                                        </th>

                                        <th>
                                            Deductions
                                        </th>

                                        <th>
                                            Net
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {[...sortedPayrolls]
                                        .reverse()
                                        .map(
                                            payroll => (

                                                <tr
                                                    key={
                                                        payroll.id
                                                    }
                                                >

                                                    <td>

                                                        <strong>

                                                            {
                                                                monthName(
                                                                    payroll.month
                                                                )
                                                            }

                                                        </strong>

                                                        {" "}

                                                        {
                                                            payroll.year
                                                        }

                                                    </td>

                                                    <td>
                                                        {
                                                            money(
                                                                payroll.basicSalary
                                                            )
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            money(
                                                                payroll.hra
                                                            )
                                                        }
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                money(
                                                                    payroll.grossSalary
                                                                )
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            money(
                                                                payroll.totalDeductions
                                                            )
                                                        }
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                money(
                                                                    payroll.netSalary
                                                                )
                                                            }
                                                        </strong>
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </>

            )}

        </div>

    );
}
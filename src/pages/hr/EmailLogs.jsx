import React, {
    useEffect,
    useState
} from "react";

import { emailLogApi } from "../../api/endpoints";


export default function EmailLogs() {

    const [logs, setLogs] = useState([]);

    const [sentCount, setSentCount] =
        useState(0);

    const [failedCount, setFailedCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD EMAIL LOGS
    // =====================================================

    const loadLogs = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                logsResponse,
                sentResponse,
                failedResponse
            ] = await Promise.all([
                emailLogApi.getAll(),
                emailLogApi.getSentCount(),
                emailLogApi.getFailedCount()
            ]);


            console.log(
                "EMAIL LOGS:",
                logsResponse.data
            );

            console.log(
                "SENT EMAILS:",
                sentResponse.data
            );

            console.log(
                "FAILED EMAILS:",
                failedResponse.data
            );


            setLogs(
                Array.isArray(
                    logsResponse.data
                )
                    ? logsResponse.data
                    : []
            );


            setSentCount(
                Number(
                    sentResponse.data || 0
                )
            );


            setFailedCount(
                Number(
                    failedResponse.data || 0
                )
            );


        } catch (err) {

            console.error(
                "EMAIL LOGS ERROR:",
                err
            );


            if (
                err.response?.status === 403
            ) {

                setError(
                    "Access denied. Please login with an HR account."
                );

            } else if (
                err.response?.status === 401
            ) {

                setError(
                    "Session expired. Please login again."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Unable to load email logs."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        loadLogs();

    }, []);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "—";
        }

        try {

            return new Date(value)
                .toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        } catch {

            return value;
        }
    };


    // =====================================================
    // STATUS
    // =====================================================

    const getStatusClass = (status) => {

        if (
            String(status)
                .toUpperCase() === "SENT"
        ) {

            return "email-status sent";
        }

        if (
            String(status)
                .toUpperCase() === "FAILED"
        ) {

            return "email-status failed";
        }

        return "email-status pending";
    };


    return (

        <div className="page">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="page-head">

                <div>

                    <div className="eyebrow">
                        HR MANAGEMENT
                    </div>

                    <h1>
                        Email Logs
                    </h1>

                    <p>
                        Monitor payroll and system email delivery.
                    </p>

                </div>


                <button
                    className="btn btn-secondary"
                    onClick={loadLogs}
                    disabled={loading}
                >
                    {loading
                        ? "Refreshing..."
                        : "Refresh"
                    }
                </button>

            </div>


            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (

                <div className="alert error">

                    <strong>
                        Error
                    </strong>

                    <span>
                        {String(error)}
                    </span>

                </div>

            )}


            {/* ================================================= */}
            {/* STATISTICS */}
            {/* ================================================= */}

            <div className="email-stats-grid">

                {/* SENT */}

                <div className="email-stat-card">

                    <div className="email-stat-icon sent-icon">
                        ✉️
                    </div>

                    <div>

                        <span>
                            Emails Sent
                        </span>

                        <strong>
                            {sentCount}
                        </strong>

                        <small>
                            Successfully delivered
                        </small>

                    </div>

                </div>


                {/* FAILED */}

                <div className="email-stat-card">

                    <div className="email-stat-icon failed-icon">
                        ⚠️
                    </div>

                    <div>

                        <span>
                            Failed Emails
                        </span>

                        <strong>
                            {failedCount}
                        </strong>

                        <small>
                            Delivery failures
                        </small>

                    </div>

                </div>


                {/* TOTAL */}

                <div className="email-stat-card">

                    <div className="email-stat-icon total-icon">
                        📧
                    </div>

                    <div>

                        <span>
                            Total Emails
                        </span>

                        <strong>
                            {logs.length}
                        </strong>

                        <small>
                            Email activity
                        </small>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* EMAIL LOG TABLE */}
            {/* ================================================= */}

            <div className="card email-log-card">

                <div className="card-header">

                    <div>

                        <h2>
                            Email Delivery History
                        </h2>

                        <p>
                            Recent email delivery activity.
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="empty-state">

                        <div className="loading-spinner">
                            ⟳
                        </div>

                        <p>
                            Loading email logs...
                        </p>

                    </div>

                ) : logs.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📭
                        </div>

                        <h3>
                            No email logs found
                        </h3>

                        <p>
                            Email delivery activity will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrap">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Employee ID
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Payroll ID
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Error
                                    </th>

                                    <th>
                                        Sent At
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {logs.map(
                                    (log) => (

                                    <tr
                                        key={log.id}
                                    >

                                        <td>
                                            #{log.id}
                                        </td>


                                        <td>

                                            <div className="employee-cell">

                                                <div className="employee-avatar">
                                                    {
                                                        log.employeeName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                            || "?"
                                                    }
                                                </div>

                                                <div>

                                                    <strong>
                                                        {
                                                            log.employeeName ||
                                                            "Unknown"
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            log.employeeCode ||
                                                            "—"
                                                        }
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        <td>
                                            {
                                                log.employeeId ||
                                                "—"
                                            }
                                        </td>


                                        <td>
                                            <span className="email-address">
                                                {
                                                    log.employeeEmail ||
                                                    "—"
                                                }
                                            </span>
                                        </td>


                                        <td>
                                            {
                                                log.payrollId
                                                    ? `#${log.payrollId}`
                                                    : "—"
                                            }
                                        </td>


                                        <td>

                                            <span
                                                className={getStatusClass(
                                                    log.status
                                                )}
                                            >

                                                <span className="status-dot">
                                                </span>

                                                {
                                                    log.status ||
                                                    "UNKNOWN"
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            {log.errorMessage ? (

                                                <span
                                                    className="email-error-message"
                                                    title={
                                                        log.errorMessage
                                                    }
                                                >
                                                    {
                                                        log.errorMessage
                                                    }
                                                </span>

                                            ) : (

                                                <span className="no-error">
                                                    —
                                                </span>

                                            )}

                                        </td>


                                        <td>
                                            {
                                                formatDate(
                                                    log.sentAt
                                                )
                                            }
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
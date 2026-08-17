import React, { useEffect, useMemo, useState } from "react";
import { leaveApprovalApi } from "../../api/endpoints";

export default function LeaveApprovals() {

    const [leaves, setLeaves] = useState([]);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [search, setSearch] = useState("");


    // =====================================================
    // LOAD LEAVE APPLICATIONS
    // =====================================================

    const loadLeaves = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await leaveApprovalApi.getAll();

            console.log(
                "HR LEAVE APPLICATIONS:",
                response.data
            );

            setLeaves(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "LEAVE APPROVAL LOAD ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load leave applications."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadLeaves();

    }, []);


    // =====================================================
    // APPROVE LEAVE
    // =====================================================

    const handleApprove = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to approve this leave?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(id);
            setError("");
            setSuccess("");

            await leaveApprovalApi.approve(id);

            setSuccess(
                "Leave application approved successfully."
            );

            await loadLeaves();

        } catch (err) {

            console.error(
                "APPROVE LEAVE ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to approve leave application."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // =====================================================
    // REJECT LEAVE
    // =====================================================

    const handleReject = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to reject this leave?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(id);
            setError("");
            setSuccess("");

            await leaveApprovalApi.reject(id);

            setSuccess(
                "Leave application rejected successfully."
            );

            await loadLeaves();

        } catch (err) {

            console.error(
                "REJECT LEAVE ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to reject leave application."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        try {

            const value =
                new Date(date);

            if (Number.isNaN(value.getTime())) {
                return date;
            }

            return value.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

        } catch {

            return date;

        }
    };


    // =====================================================
    // NORMALIZE STATUS
    // =====================================================

    const getStatus = (status) => {

        return String(
            status || "PENDING"
        ).toUpperCase();

    };


    // =====================================================
    // FILTER APPLICATIONS
    // =====================================================

    const filteredLeaves = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase();

        return leaves.filter((leave) => {

            const status =
                getStatus(leave.status);

            // Status filter
            if (
                statusFilter !== "ALL" &&
                status !== statusFilter
            ) {
                return false;
            }


            // Search
            if (!searchValue) {
                return true;
            }


            const employeeName =
                String(
                    leave.employeeName ||
                    leave.employee?.name ||
                    ""
                ).toLowerCase();


            const employeeCode =
                String(
                    leave.employeeCode ||
                    leave.employee?.employeeCode ||
                    ""
                ).toLowerCase();


            const leaveType =
                String(
                    leave.leaveType ||
                    ""
                ).toLowerCase();


            const reason =
                String(
                    leave.reason ||
                    ""
                ).toLowerCase();


            return (
                employeeName.includes(searchValue) ||
                employeeCode.includes(searchValue) ||
                leaveType.includes(searchValue) ||
                reason.includes(searchValue)
            );

        });

    }, [
        leaves,
        statusFilter,
        search
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalCount =
        leaves.length;


    const pendingCount =
        leaves.filter(
            leave =>
                getStatus(leave.status) === "PENDING"
        ).length;


    const approvedCount =
        leaves.filter(
            leave =>
                getStatus(leave.status) === "APPROVED"
        ).length;


    const rejectedCount =
        leaves.filter(
            leave =>
                getStatus(leave.status) === "REJECTED"
        ).length;


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="page leave-approval-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-head leave-page-header">

                <div>

                    <div className="page-badge">
                        HR PORTAL
                    </div>

                    <h1>
                        Leave Approvals
                    </h1>

                    <p>
                        Review and manage employee leave applications.
                    </p>

                </div>


                <button
                    className="btn btn-primary refresh-btn"
                    onClick={loadLeaves}
                    disabled={loading}
                >
                    {loading
                        ? "Refreshing..."
                        : "↻ Refresh"
                    }
                </button>

            </div>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <div className="alert error">

                    <span>⚠️</span>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {success && (

                <div className="alert success">

                    <span>✓</span>

                    <span>
                        {success}
                    </span>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="leave-stats">

                <div className="leave-stat-card">

                    <div className="leave-stat-icon">
                        📋
                    </div>

                    <div>

                        <span>
                            Total Applications
                        </span>

                        <strong>
                            {totalCount}
                        </strong>

                    </div>

                </div>


                <div
                    className="leave-stat-card pending-card"
                    onClick={() =>
                        setStatusFilter("PENDING")
                    }
                >

                    <div className="leave-stat-icon">
                        ⏳
                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pendingCount}
                        </strong>

                    </div>

                </div>


                <div
                    className="leave-stat-card approved-card"
                    onClick={() =>
                        setStatusFilter("APPROVED")
                    }
                >

                    <div className="leave-stat-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Approved
                        </span>

                        <strong>
                            {approvedCount}
                        </strong>

                    </div>

                </div>


                <div
                    className="leave-stat-card rejected-card"
                    onClick={() =>
                        setStatusFilter("REJECTED")
                    }
                >

                    <div className="leave-stat-icon">
                        ✕
                    </div>

                    <div>

                        <span>
                            Rejected
                        </span>

                        <strong>
                            {rejectedCount}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div className="card leave-filter-card">

                <div className="leave-filter">

                    <div className="leave-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search employee, code, leave type..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="leave-status-filter">

                        <label>
                            Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="APPROVED">
                                Approved
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            {/* =================================================
                LEAVE TABLE
            ================================================= */}

            <div className="card leave-table-card">

                <div className="card-title-row">

                    <div>

                        <h2>
                            Leave Applications
                        </h2>

                        <p>
                            {filteredLeaves.length}
                            {" "}
                            application
                            {filteredLeaves.length !== 1
                                ? "s"
                                : ""
                            }
                            {" "}shown
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="leave-loading">

                        <div className="loading-spinner">
                        </div>

                        <p>
                            Loading leave applications...
                        </p>

                    </div>

                ) : filteredLeaves.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📋
                        </div>

                        <h3>
                            No leave applications found
                        </h3>

                        <p>
                            There are no applications matching your current filters.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrap">

                        <table className="leave-table">

                            <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>

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

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredLeaves.map(
                                    (leave) => {

                                    const status =
                                        getStatus(
                                            leave.status
                                        );


                                    const employeeName =
                                        leave.employeeName ||
                                        leave.employee?.name ||
                                        "Unknown Employee";


                                    const employeeCode =
                                        leave.employeeCode ||
                                        leave.employee?.employeeCode ||
                                        "—";


                                    const days =
                                        leave.numberOfDays ??
                                        leave.days ??
                                        calculateDays(
                                            leave.startDate,
                                            leave.endDate
                                        );


                                    return (

                                        <tr
                                            key={leave.id}
                                        >

                                            {/* EMPLOYEE */}

                                            <td>

                                                <div className="employee-cell">

                                                    <div className="employee-avatar">
                                                        {employeeName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        }
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {employeeName}
                                                        </strong>

                                                        <small>
                                                            {employeeCode}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* LEAVE TYPE */}

                                            <td>

                                                <span className="leave-type">

                                                    {leave.leaveType ||
                                                        "—"
                                                    }

                                                </span>

                                            </td>


                                            {/* START DATE */}

                                            <td>
                                                {formatDate(
                                                    leave.startDate
                                                )}
                                            </td>


                                            {/* END DATE */}

                                            <td>
                                                {formatDate(
                                                    leave.endDate
                                                )}
                                            </td>


                                            {/* DAYS */}

                                            <td>

                                                <strong className="days-value">
                                                    {days || "—"}
                                                </strong>

                                            </td>


                                            {/* REASON */}

                                            <td>

                                                <div className="reason-cell">

                                                    {leave.reason ||
                                                        "—"
                                                    }

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `status-badge status-${status.toLowerCase()}`
                                                    }
                                                >

                                                    <span>
                                                        {status === "PENDING"
                                                            ? "●"
                                                            : status === "APPROVED"
                                                                ? "✓"
                                                                : "✕"
                                                        }
                                                    </span>

                                                    {status}

                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                {status === "PENDING" ? (

                                                    <div className="leave-actions">

                                                        <button
                                                            className="action-btn approve-btn"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    leave.id
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading ===
                                                                leave.id
                                                            }
                                                        >

                                                            {actionLoading ===
                                                            leave.id
                                                                ? "..."
                                                                : "✓ Approve"
                                                            }

                                                        </button>


                                                        <button
                                                            className="action-btn reject-btn"
                                                            onClick={() =>
                                                                handleReject(
                                                                    leave.id
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading ===
                                                                leave.id
                                                            }
                                                        >

                                                            ✕ Reject

                                                        </button>

                                                    </div>

                                                ) : (

                                                    <span className="no-action">
                                                        Completed
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}


// =====================================================
// CALCULATE DAYS
// =====================================================

function calculateDays(
    startDate,
    endDate
) {

    if (!startDate || !endDate) {
        return null;
    }

    try {

        const start =
            new Date(startDate);

        const end =
            new Date(endDate);

        const difference =
            end.getTime() -
            start.getTime();

        return (
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            ) + 1
        );

    } catch {

        return null;

    }
}
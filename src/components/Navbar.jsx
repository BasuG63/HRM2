import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ role = "EMPLOYEE" }) {

    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isHR = role === "HR";

    const hrMenu = [
        {
            label: "Dashboard",
            path: "/hr/dashboard",
            icon: "⌂"
        },
        {
            label: "Employees",
            path: "/hr/employees",
            icon: "♙"
        },
        {
            label: "Salary Structures",
            path: "/hr/salary-structures",
            icon: "₹"
        },
        {
            label: "Payroll",
            path: "/hr/payroll",
            icon: "▣"
        },
        {
            label: "Leave Approvals",
            path: "/hr/leave-approvals",
            icon: "✓"
        },
        {
            label: "Email Logs",
            path: "/hr/email-logs",
            icon: "✉"
        }
    ];

    const employeeMenu = [
        {
            label: "Dashboard",
            path: "/employee/dashboard",
            icon: "⌂"
        },
        {
            label: "Apply Leave",
            path: "/employee/apply-leave",
            icon: "＋"
        },
        {
            label: "My Leaves",
            path: "/employee/leaves",
            icon: "✓"
        },
        {
            label: "My Payroll",
            path: "/employee/payroll",
            icon: "₹"
        }
    ];

    const menu =
        isHR
            ? hrMenu
            : employeeMenu;


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");
    };


    return (
        <>
            {/* MOBILE HEADER */}

            <div className="mobile-topbar">

                <button
                    className="mobile-menu-btn"
                    onClick={() =>
                        setMobileOpen(!mobileOpen)
                    }
                >
                    ☰
                </button>

                <div className="mobile-brand">
                    HRM<span>AUTO</span>
                </div>

            </div>


            {/* OVERLAY */}

            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setMobileOpen(false)
                    }
                />
            )}


            {/* SIDEBAR */}

            <aside
                className={`
                    modern-sidebar
                    ${collapsed ? "collapsed" : ""}
                    ${mobileOpen ? "mobile-open" : ""}
                `}
            >

                {/* BRAND */}

                <div className="sidebar-brand">

                    <div className="brand-logo">
                        H
                    </div>

                    {!collapsed && (

                        <div className="brand-text">

                            <strong>
                                HRM<span>AUTO</span>
                            </strong>

                            <small>
                                Human Resource Management
                            </small>

                        </div>

                    )}

                </div>


                {/* COLLAPSE */}

                <button
                    className="collapse-btn"
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
                >
                    {collapsed ? "→" : "←"}
                </button>


                {/* ROLE */}

                {!collapsed && (

                    <div className="role-card">

                        <div className="role-icon">
                            {isHR ? "HR" : "E"}
                        </div>

                        <div>

                            <span>
                                Logged in as
                            </span>

                            <strong>
                                {isHR
                                    ? "HR Administrator"
                                    : "Employee"}
                            </strong>

                        </div>

                    </div>

                )}


                {/* MENU */}

                <nav className="sidebar-menu">

                    {!collapsed && (
                        <div className="menu-title">
                            MENU
                        </div>
                    )}

                    {menu.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className={({ isActive }) =>
                                `sidebar-link ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <span className="menu-icon">
                                {item.icon}
                            </span>

                            {!collapsed && (
                                <span>
                                    {item.label}
                                </span>
                            )}

                        </NavLink>

                    ))}

                </nav>


                {/* BOTTOM */}

                <div className="sidebar-bottom">

                    {!collapsed && (

                        <div className="user-card">

                            <div className="user-avatar">
                                {isHR ? "H" : "E"}
                            </div>

                            <div className="user-info">

                                <strong>
                                    {isHR
                                        ? "HR Admin"
                                        : "Employee"}
                                </strong>

                                <span>
                                    {isHR
                                        ? "Administrator"
                                        : "Employee Portal"}
                                </span>

                            </div>

                        </div>

                    )}


                    <button
                        className="logout-btn"
                        onClick={logout}
                        title="Logout"
                    >

                        <span>
                            ↪
                        </span>

                        {!collapsed && (
                            <span>
                                Logout
                            </span>
                        )}

                    </button>

                </div>

            </aside>
        </>
    );
}
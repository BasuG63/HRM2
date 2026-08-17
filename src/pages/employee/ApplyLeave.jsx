import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { leaveApi } from "../../api/endpoints";

export default function ApplyLeave() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        leaveType: "CL",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        // Clear old error while user edits
        if (error) {
            setError("");
        }
    };


    // =====================================================
    // GET TODAY DATE
    // =====================================================

    const getTodayDate = () => {

        return new Date()
            .toISOString()
            .split("T")[0];

    };


    // =====================================================
    // SUBMIT LEAVE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // =================================================
        // FRONTEND VALIDATION
        // =================================================

        if (!form.leaveType) {

            setError("Please select a leave type.");
            return;

        }


        if (!form.startDate || !form.endDate) {

            setError(
                "Please select both start and end dates."
            );

            return;

        }


        if (form.startDate < getTodayDate()) {

            setError(
                "You cannot apply for leave for a past date."
            );

            return;

        }


        if (form.startDate > form.endDate) {

            setError(
                "End date cannot be before start date."
            );

            return;

        }


        if (!form.reason.trim()) {

            setError(
                "Please enter a reason for leave."
            );

            return;

        }


        if (form.reason.trim().length < 3) {

            setError(
                "Please provide a valid reason for leave."
            );

            return;

        }


        // =================================================
        // SUBMIT
        // =================================================

        setLoading(true);

        try {

            const response =
                await leaveApi.apply(form);

            console.log(
                "LEAVE APPLICATION RESPONSE:",
                response.data
            );


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                "Leave application submitted successfully."
            );


            setForm({
                leaveType: "CL",
                startDate: "",
                endDate: "",
                reason: ""
            });


            // Redirect to My Leaves after short delay
            setTimeout(() => {

                navigate("/employee/my-leaves");

            }, 1200);


        } catch (error) {

            console.error(
                "APPLY LEAVE ERROR:",
                error.response?.data || error
            );


            // =================================================
            // EXTRACT BACKEND ERROR
            // =================================================

            let message =
                "Unable to apply for leave.";


            const responseData =
                error.response?.data;


            if (typeof responseData === "string") {

                message = responseData;

            }
            else if (
                responseData?.message
            ) {

                message =
                    responseData.message;

            }
            else if (
                responseData?.error
            ) {

                message =
                    responseData.error;

            }
            else if (
                error.response?.status === 400
            ) {

                message =
                    "The leave request could not be submitted. Please check the selected dates and leave details.";

            }
            else if (
                error.response?.status === 401
            ) {

                message =
                    "Your session has expired. Please login again.";

            }
            else if (
                error.response?.status === 403
            ) {

                message =
                    "You are not authorized to apply for leave.";

            }
            else if (
                error.response?.status >= 500
            ) {

                message =
                    "Server error. Please try again later.";

            }


            setError(message);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CLEAR FORM
    // =====================================================

    const clearForm = () => {

        setForm({
            leaveType: "CL",
            startDate: "",
            endDate: "",
            reason: ""
        });

        setError("");
        setSuccess("");

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="page leave-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="leave-page-header">

                <div>

                    <div className="leave-badge">
                        Employee Portal
                    </div>

                    <h1>
                        Apply for Leave
                    </h1>

                    <p>
                        Submit your leave request for HR approval.
                    </p>

                </div>


                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                        navigate("/employee/my-leaves")
                    }
                >
                    View My Leaves
                </button>

            </div>


            {/* =================================================
                ERROR ALERT
            ================================================= */}

            {error && (

                <div className="leave-alert leave-alert-error">

                    <div className="alert-icon warning-icon">
                        ⚠
                    </div>

                    <div className="alert-content">

                        <strong>
                            Leave request cannot be submitted
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =================================================
                SUCCESS ALERT
            ================================================= */}

            {success && (

                <div className="leave-alert leave-alert-success">

                    <div className="alert-icon success-icon">
                        ✓
                    </div>

                    <div className="alert-content">

                        <strong>
                            Leave Submitted
                        </strong>

                        <p>
                            {success}
                        </p>

                        <small>
                            Redirecting to My Leaves...
                        </small>

                    </div>

                </div>

            )}


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="leave-layout">


                {/* =================================================
                    FORM
                ================================================= */}

                <div className="card leave-form-card">

                    <div className="card-heading">

                        <div className="heading-icon">
                            📅
                        </div>

                        <div>

                            <h2>
                                Leave Request
                            </h2>

                            <p>
                                Enter the details of your leave.
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="leave-form"
                    >


                        {/* =================================================
                            LEAVE TYPE
                        ================================================= */}

                        <div className="form-group">

                            <label htmlFor="leaveType">

                                Leave Type

                                <span>*</span>

                            </label>

                            <select
                                id="leaveType"
                                name="leaveType"
                                value={form.leaveType}
                                onChange={handleChange}
                                required
                            >

                                <option value="CL">
                                    Casual Leave (CL)
                                </option>

                                <option value="SL">
                                    Sick Leave (SL)
                                </option>

                                <option value="EL">
                                    Earned Leave (EL)
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            DATES
                        ================================================= */}

                        <div className="form-row">


                            <div className="form-group">

                                <label htmlFor="startDate">

                                    Start Date

                                    <span>*</span>

                                </label>

                                <input
                                    id="startDate"
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    min={getTodayDate()}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="endDate">

                                    End Date

                                    <span>*</span>

                                </label>

                                <input
                                    id="endDate"
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    min={
                                        form.startDate ||
                                        getTodayDate()
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* =================================================
                            REASON
                        ================================================= */}

                        <div className="form-group">

                            <div className="label-row">

                                <label htmlFor="reason">

                                    Reason

                                    <span>*</span>

                                </label>

                                <small>
                                    {form.reason.length}/500
                                </small>

                            </div>


                            <textarea
                                id="reason"
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                maxLength={500}
                                rows={5}
                                placeholder="Explain the reason for your leave..."
                                required
                            />

                        </div>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={clearForm}
                                disabled={loading}
                            >
                                Clear
                            </button>


                            <button
                                type="submit"
                                className="submit-leave-btn"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className="spinner"></span>
                                        Submitting...
                                    </>

                                ) : (

                                    <>
                                        Submit Leave Request
                                        <span>→</span>
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>


                {/* =================================================
                    INFORMATION
                ================================================= */}

                <div className="leave-info-column">


                    {/* =================================================
                        PROCESS CARD
                    ================================================= */}

                    <div className="card info-card">

                        <div className="info-icon">
                            💡
                        </div>

                        <h3>
                            Leave Process
                        </h3>


                        <div className="process-step">

                            <div className="step-number">
                                1
                            </div>

                            <div>

                                <strong>
                                    Submit Request
                                </strong>

                                <p>
                                    Fill in your leave details.
                                </p>

                            </div>

                        </div>


                        <div className="process-line"></div>


                        <div className="process-step">

                            <div className="step-number">
                                2
                            </div>

                            <div>

                                <strong>
                                    HR Review
                                </strong>

                                <p>
                                    HR will review your request.
                                </p>

                            </div>

                        </div>


                        <div className="process-line"></div>


                        <div className="process-step">

                            <div className="step-number">
                                3
                            </div>

                            <div>

                                <strong>
                                    Approval
                                </strong>

                                <p>
                                    You will be notified of the decision.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        IMPORTANT CARD
                    ================================================= */}

                    <div className="card note-card">

                        <h3>
                            Important
                        </h3>

                        <ul>

                            <li>
                                Leave requests are reviewed by HR.
                            </li>

                            <li>
                                Select dates carefully before submitting.
                            </li>

                            <li>
                                You cannot apply for past dates.
                            </li>

                            <li>
                                You cannot submit overlapping leave requests.
                            </li>

                            <li>
                                Check your leave balance before applying.
                            </li>

                        </ul>

                    </div>


                </div>

            </div>

        </div>

    );
}
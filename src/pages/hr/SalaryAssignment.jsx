import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    employeeSalaryApi
} from "../../api/endpoints";


export default function SalaryAssignment() {

    // =====================================================
    // DATA
    // =====================================================

    const [employees, setEmployees] = useState([]);

    const [salaryStructures, setSalaryStructures] =
        useState([]);

    const [selectedEmployee, setSelectedEmployee] =
        useState("");

    const [selectedStructure, setSelectedStructure] =
        useState("");

    const [effectiveFrom, setEffectiveFrom] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [currentSalary, setCurrentSalary] =
        useState(null);

    const [salaryHistory, setSalaryHistory] =
        useState([]);


    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [assigning, setAssigning] =
        useState(false);

    const [loadingCurrent, setLoadingCurrent] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD EMPLOYEES + STRUCTURES
    // =====================================================

    useEffect(() => {

        loadInitialData();

    }, []);


    const loadInitialData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                employeeResponse,
                structureResponse
            ] = await Promise.all([

                employeeSalaryApi.getEmployees(),

                employeeSalaryApi.getSalaryStructures()

            ]);


            console.log(
                "SALARY EMPLOYEES:",
                employeeResponse.data
            );

            console.log(
                "SALARY STRUCTURES:",
                structureResponse.data
            );


            setEmployees(
                Array.isArray(employeeResponse.data)
                    ? employeeResponse.data
                    : []
            );


            setSalaryStructures(
                Array.isArray(structureResponse.data)
                    ? structureResponse.data
                    : []
            );


        } catch (err) {

            console.error(
                "SALARY ASSIGNMENT LOAD ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load employees and salary structures."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // SELECTED EMPLOYEE
    // =====================================================

    const employee = useMemo(() => {

        return employees.find(
            (item) =>
                String(item.id) ===
                String(selectedEmployee)
        );

    }, [
        employees,
        selectedEmployee
    ]);


    // =====================================================
    // SELECTED SALARY STRUCTURE
    // =====================================================

    const structure = useMemo(() => {

        return salaryStructures.find(
            (item) =>
                String(item.id) ===
                String(selectedStructure)
        );

    }, [
        salaryStructures,
        selectedStructure
    ]);


    // =====================================================
    // LOAD CURRENT SALARY + HISTORY
    // =====================================================

    const loadEmployeeSalary = async (
        employeeId
    ) => {

        if (!employeeId) {

            setCurrentSalary(null);
            setSalaryHistory([]);

            return;
        }


        try {

            setLoadingCurrent(true);
            setError("");

            const [
                currentResponse,
                historyResponse
            ] = await Promise.all([

                employeeSalaryApi
                    .getCurrent(employeeId),

                employeeSalaryApi
                    .getHistory(employeeId)

            ]);


            console.log(
                "CURRENT SALARY:",
                currentResponse.data
            );

            console.log(
                "SALARY HISTORY:",
                historyResponse.data
            );


            setCurrentSalary(
                currentResponse.data
            );


            setSalaryHistory(
                Array.isArray(historyResponse.data)
                    ? historyResponse.data
                    : []
            );


        } catch (err) {

            console.error(
                "EMPLOYEE SALARY LOAD ERROR:",
                err
            );

            /*
             * No current salary is also a valid state
             * for a new employee.
             */

            if (
                err.response?.status === 404
            ) {

                setCurrentSalary(null);

                try {

                    const historyResponse =
                        await employeeSalaryApi
                            .getHistory(employeeId);

                    setSalaryHistory(
                        Array.isArray(
                            historyResponse.data
                        )
                            ? historyResponse.data
                            : []
                    );

                } catch {

                    setSalaryHistory([]);

                }

            } else {

                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Unable to load employee salary."
                );

            }

        } finally {

            setLoadingCurrent(false);

        }
    };


    // =====================================================
    // EMPLOYEE CHANGE
    // =====================================================

    const handleEmployeeChange = async (e) => {

        const employeeId =
            e.target.value;

        setSelectedEmployee(employeeId);

        setSuccess("");
        setError("");

        await loadEmployeeSalary(
            employeeId
        );
    };


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const money = (value) => {

        const number =
            Number(value || 0);

        return `₹${number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    // =====================================================
    // STRUCTURE VALUE
    // =====================================================

    const getStructureValue = (
        field
    ) => {

        if (!structure) {
            return 0;
        }

        return Number(
            structure[field] || 0
        );
    };


    // =====================================================
    // SALARY PREVIEW
    // =====================================================

    const basicSalary =
        getStructureValue(
            "basicSalary"
        );

    const hra =
        getStructureValue(
            "hra"
        );

    const specialAllowance =
        getStructureValue(
            "specialAllowance"
        );

    const grossSalary =
        getStructureValue(
            "grossSalary"
        );

    const pfAmount =
        getStructureValue(
            "pfAmount"
        );

    const esiAmount =
        getStructureValue(
            "esiAmount"
        );

    const professionalTax =
        getStructureValue(
            "professionalTax"
        );

    const totalDeductions =
        pfAmount +
        esiAmount +
        professionalTax;

    const netSalary =
        grossSalary -
        totalDeductions;


    // =====================================================
    // ASSIGN SALARY
    // =====================================================

    const handleAssign = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!selectedEmployee) {

            setError(
                "Please select an employee."
            );

            return;
        }


        if (!selectedStructure) {

            setError(
                "Please select a salary structure."
            );

            return;
        }


        if (!effectiveFrom) {

            setError(
                "Please select effective date."
            );

            return;
        }


        try {

            setAssigning(true);


            const request = {

                employeeId:
                    Number(selectedEmployee),

                salaryStructureId:
                    Number(selectedStructure),

                effectiveFrom:
                    effectiveFrom

            };


            console.log(
                "ASSIGN SALARY REQUEST:",
                request
            );


            const response =
                await employeeSalaryApi.assign(
                    request
                );


            console.log(
                "ASSIGN SALARY RESPONSE:",
                response.data
            );


            setSuccess(
                "Salary assigned successfully."
            );


            // Reload current salary
            await loadEmployeeSalary(
                selectedEmployee
            );


        } catch (err) {

            console.error(
                "ASSIGN SALARY ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to assign salary."
            );

        } finally {

            setAssigning(false);

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page">

                <div className="card">

                    <p>
                        Loading salary assignment...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-head">

                <div>

                    <h1>
                        Assign Salary
                    </h1>

                    <p>
                        Assign a salary structure to an employee
                        and manage salary history.
                    </p>

                </div>

            </div>


            {/* =================================================
                ALERTS
            ================================================= */}

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


            {/* =================================================
                ASSIGN FORM
            ================================================= */}

            <div className="card salary-assignment-card">

                <div className="section-title">

                    <div>

                        <h2>
                            Salary Assignment
                        </h2>

                        <p>
                            Select an employee and salary
                            structure.
                        </p>

                    </div>

                </div>


                <form
                    onSubmit={handleAssign}
                >

                    <div className="form-grid">


                        {/* EMPLOYEE */}

                        <div className="field">

                            <label>
                                Employee
                            </label>

                            <select
                                value={selectedEmployee}
                                onChange={
                                    handleEmployeeChange
                                }
                                required
                            >

                                <option value="">
                                    Select Employee
                                </option>

                                {employees.map(
                                    (item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {item.employeeCode
                                            ? `${item.employeeCode} - `
                                            : ""
                                        }

                                        {item.name}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* STRUCTURE */}

                        <div className="field">

                            <label>
                                Salary Structure
                            </label>

                            <select
                                value={
                                    selectedStructure
                                }
                                onChange={(e) => {

                                    setSelectedStructure(
                                        e.target.value
                                    );

                                    setSuccess("");
                                    setError("");

                                }}
                                required
                            >

                                <option value="">
                                    Select Salary Structure
                                </option>

                                {salaryStructures
                                    .filter(
                                        (item) =>
                                            item.active !== false
                                    )
                                    .map(
                                        (item) => (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {item.structureName ||
                                                `Structure #${item.id}`
                                            }

                                        </option>

                                    ))}

                            </select>

                        </div>


                        {/* EFFECTIVE DATE */}

                        <div className="field">

                            <label>
                                Effective From
                            </label>

                            <input
                                type="date"
                                value={
                                    effectiveFrom
                                }
                                onChange={(e) =>
                                    setEffectiveFrom(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* EMPLOYEE INFO */}

                        {employee && (

                            <div className="employee-mini-card">

                                <span>
                                    Employee
                                </span>

                                <strong>
                                    {employee.name}
                                </strong>

                                <small>
                                    {employee.employeeCode ||
                                        "No employee code"
                                    }

                                    {employee.designation
                                        ? ` • ${employee.designation}`
                                        : ""
                                    }
                                </small>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        SALARY PREVIEW
                    ================================================= */}

                    {structure && (

                        <div className="salary-preview-section">

                            <div className="section-title">

                                <div>

                                    <h3>
                                        Salary Preview
                                    </h3>

                                    <p>
                                        Values are taken from
                                        the selected salary
                                        structure.
                                    </p>

                                </div>

                            </div>


                            <div className="salary-preview-grid">


                                <SalaryBox
                                    label="Basic Salary"
                                    value={money(
                                        basicSalary
                                    )}
                                />

                                <SalaryBox
                                    label="HRA"
                                    value={money(
                                        hra
                                    )}
                                />

                                <SalaryBox
                                    label="Special Allowance"
                                    value={money(
                                        specialAllowance
                                    )}
                                />

                                <SalaryBox
                                    label="Gross Salary"
                                    value={money(
                                        grossSalary
                                    )}
                                    highlight
                                />

                                <SalaryBox
                                    label="PF"
                                    value={money(
                                        pfAmount
                                    )}
                                    deduction
                                />

                                <SalaryBox
                                    label="ESI"
                                    value={money(
                                        esiAmount
                                    )}
                                    deduction
                                />

                                <SalaryBox
                                    label="Professional Tax"
                                    value={money(
                                        professionalTax
                                    )}
                                    deduction
                                />

                                <SalaryBox
                                    label="Total Deductions"
                                    value={money(
                                        totalDeductions
                                    )}
                                    deduction
                                />


                                <div className="net-salary-box">

                                    <span>
                                        Net Salary
                                    </span>

                                    <strong>
                                        {money(
                                            netSalary
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    )}


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                assigning ||
                                !selectedEmployee ||
                                !selectedStructure
                            }
                        >

                            {assigning
                                ? "Assigning..."
                                : "Assign Salary"
                            }

                        </button>

                    </div>

                </form>

            </div>


            {/* =================================================
                CURRENT SALARY
            ================================================= */}

            {selectedEmployee && (

                <div className="card">

                    <div className="section-title">

                        <div>

                            <h2>
                                Current Salary
                            </h2>

                            <p>
                                Active salary assigned to
                                this employee.
                            </p>

                        </div>

                    </div>


                    {loadingCurrent ? (

                        <p>
                            Loading current salary...
                        </p>

                    ) : currentSalary ? (

                        <div className="current-salary-grid">

                            <SalaryBox
                                label="Structure"
                                value={
                                    currentSalary.structureName ||
                                    "—"
                                }
                            />

                            <SalaryBox
                                label="Basic"
                                value={money(
                                    currentSalary.basicSalary
                                )}
                            />

                            <SalaryBox
                                label="HRA"
                                value={money(
                                    currentSalary.hra
                                )}
                            />

                            <SalaryBox
                                label="Special Allowance"
                                value={money(
                                    currentSalary.specialAllowance
                                )}
                            />

                            <SalaryBox
                                label="Gross"
                                value={money(
                                    currentSalary.grossSalary
                                )}
                                highlight
                            />

                            <SalaryBox
                                label="Total Deductions"
                                value={money(
                                    currentSalary.totalDeductions
                                )}
                                deduction
                            />

                            <SalaryBox
                                label="Net Salary"
                                value={money(
                                    currentSalary.netSalary
                                )}
                                highlight
                            />

                            <SalaryBox
                                label="Effective From"
                                value={
                                    currentSalary.effectiveFrom ||
                                    "—"
                                }
                            />

                        </div>

                    ) : (

                        <div className="empty-state">

                            <strong>
                                No active salary
                            </strong>

                            <span>
                                This employee does not have
                                an active salary assignment.
                            </span>

                        </div>

                    )}

                </div>

            )}


            {/* =================================================
                SALARY HISTORY
            ================================================= */}

            {selectedEmployee && (

                <div className="card">

                    <div className="section-title">

                        <div>

                            <h2>
                                Salary History
                            </h2>

                            <p>
                                Previous and current salary
                                assignments.
                            </p>

                        </div>

                    </div>


                    {salaryHistory.length === 0 ? (

                        <div className="empty-state">

                            <strong>
                                No salary history
                            </strong>

                            <span>
                                No salary records found for
                                this employee.
                            </span>

                        </div>

                    ) : (

                        <div className="table-wrap">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Structure
                                        </th>

                                        <th>
                                            Basic
                                        </th>

                                        <th>
                                            Gross
                                        </th>

                                        <th>
                                            Deductions
                                        </th>

                                        <th>
                                            Net Salary
                                        </th>

                                        <th>
                                            Effective From
                                        </th>

                                        <th>
                                            Effective To
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {salaryHistory.map(
                                        (item) => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            <td>
                                                {
                                                    item.structureName ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {money(
                                                    item.basicSalary
                                                )}
                                            </td>

                                            <td>
                                                {money(
                                                    item.grossSalary
                                                )}
                                            </td>

                                            <td>
                                                {money(
                                                    item.totalDeductions
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {money(
                                                        item.netSalary
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    item.effectiveFrom ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.effectiveTo ||
                                                    "Current"
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        item.active
                                                            ? "status-badge active"
                                                            : "status-badge inactive"
                                                    }
                                                >

                                                    {item.active
                                                        ? "ACTIVE"
                                                        : "INACTIVE"
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}


// =====================================================
// SALARY BOX
// =====================================================

function SalaryBox({
    label,
    value,
    highlight = false,
    deduction = false
}) {

    return (

        <div
            className={`
                salary-box
                ${highlight ? "highlight" : ""}
                ${deduction ? "deduction" : ""}
            `}
        >

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}
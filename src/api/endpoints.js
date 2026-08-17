import client from "./client";


// =====================================================
// AUTH
// =====================================================

export const authApi = {

    login: (data) =>
        client.post(
            "/api/auth/login",
            data
        )

};


// =====================================================
// EMPLOYEE MANAGEMENT - HR
// =====================================================

export const employeeApi = {

    // Get all employees
    getAll: () =>
        client.get(
            "/api/hr/employees"
        ),

    // Get employee by ID
    getById: (id) =>
        client.get(
            `/api/hr/employees/${id}`
        ),

    // Search by Employee Code
    searchByCode: (employeeCode) =>
        client.get(
            `/api/hr/employees/search?employeeCode=${encodeURIComponent(employeeCode)}`
        ),

    // Search by Phone
    searchByPhone: (phone) =>
        client.get(
            `/api/hr/employees/search?phone=${encodeURIComponent(phone)}`
        ),

    // Create employee
    create: (data) =>
        client.post(
            "/api/hr/employees",
            data
        )

};


// =====================================================
// SALARY STRUCTURE - HR
// =====================================================

export const salaryApi = {

    // Get all salary structures
    getAll: () =>
        client.get(
            "/api/hr/salary-structures"
        ),

    // Get salary structure by ID
    getById: (id) =>
        client.get(
            `/api/hr/salary-structures/${id}`
        ),

    // Create salary structure
    create: (data) =>
        client.post(
            "/api/hr/salary-structures",
            data
        ),

    // Update salary structure
    update: (id, data) =>
        client.put(
            `/api/hr/salary-structures/${id}`,
            data
        ),

    // Delete salary structure
    delete: (id) =>
        client.delete(
            `/api/hr/salary-structures/${id}`
        )

};


// =====================================================
// EMPLOYEE SALARY - HR
// =====================================================

export const employeeSalaryApi = {

    // Get employees
    getEmployees: () =>
        client.get(
            "/api/hr/employees"
        ),

    // Get salary structures
    getSalaryStructures: () =>
        client.get(
            "/api/hr/salary-structures"
        ),

    // Assign salary
    assign: (data) =>
        client.post(
            "/api/hr/employee-salary/assign",
            data
        ),

    // Get current salary
    // Backend:
    // GET /api/hr/employee-salary/{employeeId}
    getCurrent: (employeeId) =>
        client.get(
            `/api/hr/employee-salary/${employeeId}`
        ),

    // Get salary history
    // Backend:
    // GET /api/hr/employee-salary/{employeeId}/history
    getHistory: (employeeId) =>
        client.get(
            `/api/hr/employee-salary/${employeeId}/history`
        )

};
// =====================================================
// HR PAYROLL
// =====================================================

export const payrollApi = {

    // -------------------------------------------------
    // Get current month payroll
    // -------------------------------------------------

    getAll: () =>
        client.get(
            "/api/hr/payroll"
        ),


    // -------------------------------------------------
    // Get payroll by month
    // -------------------------------------------------

    getByMonth: (year, month) =>
        client.get(
            `/api/hr/payroll/month/${year}/${month}`
        ),


    // -------------------------------------------------
    // Get payroll by ID
    // -------------------------------------------------

    getById: (payrollId) =>
        client.get(
            `/api/hr/payroll/${payrollId}`
        ),


    // -------------------------------------------------
    // PROCESS PAYROLL
    // -------------------------------------------------

    processPayroll: (data) =>
        client.post(
            "/api/hr/payroll/process",
            data
        ),


    // -------------------------------------------------
    // DOWNLOAD PAYSLIP PDF
    // -------------------------------------------------

    downloadPayslip: (payrollId) =>
        client.get(
            `/api/hr/payroll/${payrollId}/payslip/pdf`,
            {
                responseType: "blob"
            }
        ),


    // -------------------------------------------------
    // SEND PAYSLIP EMAIL
    // -------------------------------------------------

    sendPayslipEmail: (payrollId) =>
        client.post(
            `/api/hr/payroll/${payrollId}/payslip/email`
        )

};

// =====================================================
// EMPLOYEE PAYROLL
// =====================================================

export const employeePayrollApi = {

    // Get logged-in employee payroll history
    getMyPayroll: () =>
        client.get(
            "/api/employee/payroll/my"
        ),

    // Get payroll for specific month
    getMyPayrollForMonth: (year, month) =>
        client.get(
            `/api/employee/payroll/my/${year}/${month}`
        ),

    // Download payslip
    downloadPayslip: (year, month) =>
        client.get(
            `/api/employee/payroll/my/${year}/${month}/pdf`,
            {
                responseType: "blob"
            }
        )

};


// =====================================================
// EMPLOYEE LEAVE
// =====================================================

export const leaveApi = {

    // Apply leave
    apply: (data) =>
        client.post(
            "/api/employee/leave/apply",
            data
        ),

    // My leaves
    mine: () =>
        client.get(
            "/api/employee/leave/my"
        ),

    // Leave balance
    balance: () =>
        client.get(
            "/api/employee/leave/balance"
        )

};


// =====================================================
// HR LEAVE APPROVAL
// =====================================================

export const leaveApprovalApi = {

    // Get pending leaves
    getAll: () =>
        client.get(
            "/api/hr/leave/pending"
        ),

    // Approve leave
    approve: (id) =>
        client.put(
            `/api/hr/leave/${id}/approve`
        ),

    // Reject leave
    reject: (id) =>
        client.put(
            `/api/hr/leave/${id}/reject`
        )

};


// =====================================================
// EMAIL LOGS - HR
// =====================================================
// =====================================================
// EMAIL DELIVERY LOGS - HR
// =====================================================

export const emailLogApi = {

    // Get all email logs
    getAll: () =>
        client.get(
            "/api/hr/email-logs"
        ),

    // Get logs for a particular payroll
    getByPayroll: (payrollId) =>
        client.get(
            `/api/hr/email-logs/payroll/${payrollId}`
        ),

    // Get SENT email count
    getSentCount: () =>
        client.get(
            "/api/hr/email-logs/sent/count"
        ),

    // Get FAILED email count
    getFailedCount: () =>
        client.get(
            "/api/hr/email-logs/failed/count"
        )

};
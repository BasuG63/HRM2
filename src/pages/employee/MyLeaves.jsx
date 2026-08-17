import React, {
    useEffect,
    useState
} from "react";

import { leaveApi } from "../../api/endpoints";


export default function MyLeaves() {

    const [leaves, setLeaves] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const loadLeaves = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await leaveApi.mine();

            console.log(
                "MY LEAVES:",
                response.data
            );

            setLeaves(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "MY LEAVES ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load leave applications."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadLeaves();

    }, []);


    return (

        <div className="page">

            <h1>
                My Leaves
            </h1>

            <p>
                View your leave applications.
            </p>


            {error && (

                <div className="alert error">
                    {error}
                </div>

            )}


            <div className="card">

                <h2>
                    Leave Applications
                </h2>


                {loading && (

                    <p>
                        Loading...
                    </p>

                )}


                {!loading &&
                    !error &&
                    leaves.length === 0 && (

                    <p>
                        No leave applications found.
                    </p>

                )}


                {!loading &&
                    leaves.length > 0 && (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Employee Code
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

                                </tr>

                            </thead>


                            <tbody>

                                {leaves.map(
                                    (leave) => (

                                    <tr
                                        key={leave.id}
                                    >

                                        <td>
                                            {leave.employeeCode || "—"}
                                        </td>

                                        <td>
                                            {leave.leaveType || "—"}
                                        </td>

                                        <td>
                                            {leave.startDate || "—"}
                                        </td>

                                        <td>
                                            {leave.endDate || "—"}
                                        </td>

                                        <td>
                                            {leave.numberOfDays || "—"}
                                        </td>

                                        <td>
                                            {leave.reason || "—"}
                                        </td>

                                        <td>
                                            {leave.status || "—"}
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
import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/DashboardSideBar";
import { message, Tooltip } from "antd";

const RequestsReceived = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch received requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/borrow-requests/received`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to load requests", err);
        setError("Unable to load received requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/borrow-requests/${requestId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Borrow request approved successfully.");
      setRequests((prev) =>
        prev.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      message.error("Failed to approve request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/borrow-requests/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.info("Borrow request rejected.");
      setRequests((prev) =>
        prev.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      message.error("Failed to reject request.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-24 text-xl font-semibold">
        Loading requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-24 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />

      {/* Page offset for fixed header */}
      <main className="pt-20 flex">
        <Sidebar/>

        {/* Content */}
        <div className="ml-64 w-full px-6 py-10">
          <h2 className="text-2xl font-bold mb-6">Requests Received</h2>

          {requests.length === 0 ? (
            <p className="text-gray-600">
              No borrow requests received yet.
            </p>
          ): 

          (
            <div className="space-y-6">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="border rounded-lg p-6 shadow-sm bg-white max-w-xl">
                  <div className="space-y-1 text-gray-800">

                    <p>
                      <span className="font-medium">Title:</span>{" "}
                      {req.book?.title}
                    </p>

                    <p>
                      <span className="font-medium">Author:</span>{" "}
                      {req.book?.author}
                    </p>

                    <p>
                      <span className="font-medium">Requested by:</span>{" "}
                      {req.borrower?.name}
                    </p>

                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {req.book?.availableLocation?.locationName}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Tooltip title="Approve this borrow request">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        Approve
                      </button>
                    </Tooltip>

                    <Tooltip title="Reject this borrow request">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                        Reject
                      </button>
                    </Tooltip>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestsReceived;

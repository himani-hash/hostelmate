"use client";

import { useEffect, useState } from "react";

type Leave = {
  id: number;
  student_name: string;
  student_email: string;
  hostel_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  destination: string;
  parent_contact: string;
  contact_number: string;
  status: string;
  warden_comment?: string;
  created_at: string;
};

export default function WardenLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<number | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, [page, statusFilter]);

const fetchLeaves = async () => {
  setLoading(true); 

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/all-leaves?page=${page}&status=${statusFilter}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const result = await res.json();

    console.log("FULL RESPONSE:", result);

    if (Array.isArray(result)) {
      setLeaves(result);
      setTotalPages(1);
    } else {
      setLeaves(result.data || []);
      setTotalPages(result.total_pages || 1);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false); 
  }
};
  const handleApprove = async (id: number) => {
    setActionLoading(id);
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "approved" }),
    });
    setActionLoading(null);
    fetchLeaves();
  };

  const openReject = (id: number) => {
    setSelectedLeave(id);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectComment) {
      alert("Enter reason");
      return;
    }

    setActionLoading(selectedLeave);

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/${selectedLeave}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: "rejected",
          warden_comment: rejectComment,
        }),
      }
    );

    setShowRejectModal(false);
    setRejectComment("");
    setActionLoading(null);
    fetchLeaves();
  };

  return (
    <div className="min-h-screen px-6 py-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Leave Applications
      </h1>


      <div className="flex gap-3 mb-6">
        <div className="flex gap-3 mb-6 items-center">
        <select
          value={statusFilter}
          disabled={loading}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

 
        {loading && (
          <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
        )}
      </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">

            {Array.isArray(leaves) ? (
              leaves.length > 0 ? (
                leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border hover:shadow-xl transition"
                  >

                
                    <div className="text-center mb-4">
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {leave.hostel_name}
                      </p>
                    </div>

                 
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {leave.student_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {leave.student_email}
                      </p>
                    </div>

                
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                        {leave.leave_type}
                      </span>

                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>

            
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">From</p>
                        <p className="font-medium">
                          {new Date(leave.start_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">To</p>
                        <p className="font-medium">
                          {new Date(leave.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                  
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Reason:</span> {leave.reason}</p>
                      <p><span className="text-gray-500">Destination:</span> {leave.destination}</p>
                      <p><span className="text-gray-500">Parent Contact:</span> {leave.parent_contact}</p>
                      <p><span className="text-gray-500">Student Contact:</span> {leave.contact_number}</p>
                    </div>

             
                    {leave.status === "rejected" && leave.warden_comment && (
                      <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        <strong>Reject Reason:</strong> {leave.warden_comment}
                      </div>
                    )}

                
                    {leave.status === "pending" && (
                      <div className="flex gap-3 mt-5">

                        <button
                          onClick={() => handleApprove(leave.id)}
                          disabled={actionLoading === leave.id}
                          className="flex-1 bg-green-600 text-white py-2 rounded-md text-sm flex justify-center items-center gap-2"
                        >
                          {actionLoading === leave.id ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            "Approve"
                          )}
                        </button>

                        <button
                          onClick={() => openReject(leave.id)}
                          className="flex-1 bg-red-600 text-white py-2 rounded-md text-sm"
                        >
                          Reject
                        </button>

                      </div>
                    )}

               
                    <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                      Applied on: {new Date(leave.created_at).toLocaleString()}
                    </div>

                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500">
                  No leave applications found
                </p>
              )
            ) : (
              <p className="col-span-2 text-center text-red-500">
                Invalid data format
              </p>
            )}

          </div>

   
          <div className="flex justify-center mt-8 gap-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 text-sm font-medium">
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}


      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">Reject Leave</h2>

            <textarea
              placeholder="Enter reason..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white py-2 rounded flex justify-center items-center gap-2"
              >
                {actionLoading === selectedLeave ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Submit"
                )}
              </button>

              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
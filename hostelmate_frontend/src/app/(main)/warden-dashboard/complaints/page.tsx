"use client";

import { useEffect, useState } from "react";

type Complaint = {
  id: number;
  hostel_id: number;
  category: string;
  description: string;
  priority: string;
  status: string;
  is_anonymous: boolean;
  user_name: string | null;
  user_email: string | null;
  created_at: string;
};

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");


  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [status, setStatus] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [updating, setUpdating] = useState(false);


  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);

      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/all-complaints?page=${page}`;

        if (statusFilter) url += `&status=${statusFilter}`;
        if (priorityFilter) url += `&priority=${priorityFilter}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        setComplaints(data.complaints);
        setTotalPages(data.pages);
      } catch (err) {
        console.error("Error fetching complaints", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [page, statusFilter, priorityFilter]);


  const openModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setStatus(c.status);
    setAdminResponse("");
  };


  const handleUpdate = async () => {
    if (!selectedComplaint) return;

    setUpdating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/complaints/${selectedComplaint.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status,
            admin_response: adminResponse,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      setSelectedComplaint(null);
      setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-950">
 
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Warden Complaints Dashboard
      </h1>

    
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="p-2 rounded border dark:bg-gray-800"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPage(1);
            setPriorityFilter(e.target.value);
          }}
          className="p-2 rounded border dark:bg-gray-800"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

 
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : (
        <>
     
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="flex flex-col justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-5 space-y-4 hover:shadow-lg transition"
              >
       
                <div className="space-y-4">
              
                  <div className="flex justify-between">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                      {c.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>

          
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {c.is_anonymous ? (
                      <p className="text-sm italic text-gray-500">
                        Anonymous Complaint
                      </p>
                    ) : (
                      <>
                        <p className="font-semibold">
                          👤 {c.user_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          📧 {c.user_email}
                        </p>
                      </>
                    )}
                  </div>


                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {c.description}
                  </p>
                </div>

              
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-purple-600 text-xs font-semibold">
                      Priority: {c.priority}
                    </p>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        c.status === "resolved"
                          ? "bg-green-100 text-green-600"
                          : c.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

     
                  <button
                    onClick={() => openModal(c)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>

     
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-gray-700 dark:text-white">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

  
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Update Complaint
            </h2>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-800"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <textarea
              placeholder="Admin response"
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-800"
            />

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              {updating ? "Updating..." : "Submit"}
            </button>

            <button
              onClick={() => setSelectedComplaint(null)}
              className="w-full text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
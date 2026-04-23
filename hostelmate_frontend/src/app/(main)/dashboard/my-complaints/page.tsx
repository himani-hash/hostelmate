"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Complaint = {
  id: number;
  category: string;
  priority: string;
  status: string;
  description: string;
  admin_response: string | null;
  resolved_by: number | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string | null;
};

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/complaints`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      
   
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Complaints
        </h1>

        <button
          onClick={() => router.push("/dashboard/complaints")}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          + Register Complaint
        </button>
      </div>

 
      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Loading complaints...
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No complaints found
        </div>
      ) : (
        <div className="grid gap-5">
          {complaints.map((c) => {
            const isResolved = c.status === "resolved";

            return (
              <div
                key={c.id}
                className={`p-5 rounded-xl shadow-md border transition
                  ${
                    isResolved
                      ? "bg-green-100 dark:bg-green-900 border-green-300"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
              >
           
                <div className="flex justify-between items-center mb-3">
                  
           
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {c.category}
                  </span>

           
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full
                    ${
                      c.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : c.status === "in_progress"
                        ? "bg-purple-100 text-purple-700"
                        : c.status === "resolved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

              
                <p className="text-gray-800 dark:text-gray-200 text-lg mb-3">
                  {c.description}
                </p>

        
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span>
                    <strong>Priority:</strong> {c.priority}
                  </span>
                  <span>
                    <strong>Created:</strong>{" "}
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>

                {c.admin_response && (
                  <div className="mt-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Warden Response
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {c.admin_response}
                    </p>
                  </div>
                )}

                {c.resolved_at && (
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    Resolved on:{" "}
                    {new Date(c.resolved_at).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
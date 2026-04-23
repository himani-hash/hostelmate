"use client";

import { useEffect, useState } from "react";

type Complaint = {
  id: number;
  category: string;
  priority: string;
  status: string;
  description: string;
  created_at: string;
  is_anonymous: boolean;
  user_name: string | null;
  user_email: string | null;
};

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/all-complaints`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      {/* 🔹 Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Warden Complaints Dashboard
        </h2>
      </div>

      {/* 🔹 Content */}
      <div className="p-6 max-w-5xl mx-auto space-y-5">

        {complaints.length === 0 ? (
          <p className="text-center text-gray-500">
            No complaints found
          </p>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition"
            >

              <div className="flex justify-between items-center mb-3">

          
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {c.category}
                </span>

            
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    c.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : c.status === "in_progress"
                      ? "bg-blue-100 text-blue-700"
                      : c.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {c.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-gray-800 dark:text-gray-100 text-base font-medium mb-4">
                {c.description}
              </p>

           
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                {c.is_anonymous ? (
                  <span className="italic text-gray-400">
                    Anonymous User
                  </span>
                ) : (
                  <span>
                     {c.user_name} • {c.user_email}
                  </span>
                )}
              </div>

             
              <div className="flex justify-between items-center text-sm text-gray-500">

              
                <span
                  className={`px-2 py-1 rounded ${
                    c.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : c.priority === "medium"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {c.priority}
                </span>

         
                <span>
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
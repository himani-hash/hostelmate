"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Complaint = {
  id: number;
  category: string;
  priority: string;
  status: string;
  description: string;
};

export default function MyComplaintsPage() {
  const router = useRouter();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/complaints`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      
      <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          My Complaints
        </h2>

 
        <button
          onClick={() => router.push("/dashboard/complaints")}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
           Register Complaint
        </button>
      </div>

  
      <div className="p-6 max-w-5xl mx-auto">

        {complaints.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No complaints found 
          </div>
        ) : (
          <div className="grid gap-5">

            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition duration-300"
              >

                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {c.category}
                  </h3>

               
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
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

             
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {c.description}
                </p>

                {/* 🔹 Footer */}
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

                  
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
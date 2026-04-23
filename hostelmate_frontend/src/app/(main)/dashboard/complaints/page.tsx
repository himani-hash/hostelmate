"use client";

import { useRouter } from "next/navigation";


import { useState, useEffect } from "react";

type Hostel = {
  id: number;
  name: string;
  code: string;
};

type FormData = {
  hostel_id: string;
  category: string;
  priority: string;
  description: string;
  is_anonymous: boolean;
};

export default function ComplaintPage() {
    const router = useRouter();
  const [form, setForm] = useState<FormData>({
    hostel_id: "",
    category: "",
    priority: "",
    description: "",
    is_anonymous: false,
  });

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loadingHostels, setLoadingHostels] = useState(true);

 
 useEffect(() => {
  const fetchHostels = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hostels`);

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setHostels(data);

    } catch (err) {
      console.error("Error loading hostels:", err);
    } finally {
      setLoadingHostels(false);
    }
  };

  fetchHostels();
}, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true); 

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/complaints`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    alert("Complaint submitted successfully");

   
    setForm({
      hostel_id: "",
      category: "",
      priority: "",
      description: "",
      is_anonymous: false,
    });

  } catch (err) {
    console.error(err);
    alert("Error submitting complaint");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

   
      <div className="flex justify-center gap-4 py-6 border-b dark:border-gray-700">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Register Complaint
        </button>

        <button
            onClick={() => router.push("/dashboard/my-complaints")}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded-lg"
            >
            My Complaints
        </button>
      </div>

  
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Register Complaint
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

          
            <select
              name="hostel_id"
              value={form.hostel_id}
              onChange={handleChange}
              className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
              required
              disabled={loadingHostels}
            >
              <option value="">
                {loadingHostels ? "Loading hostels..." : "Select Hostel"}
              </option>

              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.code})
                </option>
              ))}
            </select>

        
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="staff">Staff</option>
              <option value="facilities">Facilities</option>
              <option value="other">Other</option>
            </select>

   
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full p-3 rounded border dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

       
            <textarea
              name="description"
              placeholder="Describe your issue..."
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded border h-32 dark:bg-gray-700 dark:text-white"
              required
            />

            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="is_anonymous"
                checked={form.is_anonymous}
                onChange={handleChange}
              />
              Submit as Anonymous
            </label>

      
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white transition 
                ${loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  
                  {/* 🔄 Spinner */}
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                  Submitting...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
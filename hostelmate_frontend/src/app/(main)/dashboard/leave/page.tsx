"use client";

import { useState, useEffect } from "react";

type Hostel = {
  id: number;
  name: string;
};

export default function LeavePage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hostel_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    parent_contact: "",
    contact_number: "", 
    destination: "",
  });


  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/hostels`
        );
        const data = await res.json();
        setHostels(data);
      } catch (err) {
        console.error("Error loading hostels", err);
      } finally {
        setLoadingHostels(false);
      }
    };

    fetchHostels();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Leave Applied Successfully");

      setForm({
        hostel_id: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
        parent_contact: "",
        contact_number: "",
        destination: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 px-6 py-6">

      <div className="flex gap-3 mb-6">
        <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
          Leave Application
        </button>
      </div>

    
      <div className="w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">

        <form onSubmit={handleSubmit} className="space-y-5">

     
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Hostel
            </label>
            <select
              name="hostel_id"
              value={form.hostel_id}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Hostel</option>
              {!loadingHostels &&
                hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
            </select>
          </div>

            <div>
            <label className="font-semibold">Leave Type</label>
            <select
              name="leave_type"
              value={form.leave_type}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option>Day outing</option>
              <option>Night out</option>
              <option>Home visit</option>
              <option>Medical</option>
            </select>
          </div>

        
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">From Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-semibold">To Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

       
          <div>
            <label className="font-semibold">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

   
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Parent Contact</label>
              <input
                type="text"
                name="parent_contact"
                value={form.parent_contact}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-semibold">Student Contact</label>
              <input
                type="text"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

    
          <div>
            <label className="font-semibold">Destination</label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

 
          <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-white text-sm font-medium transition ${
                    loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
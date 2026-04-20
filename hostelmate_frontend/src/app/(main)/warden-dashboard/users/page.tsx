"use client";

import React, { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  phone?: string;
  course?: string;
  year?: string;
  hostel_id?: number;
  room_number?: string;
};

type Hostel = {
  id: number;
  name: string;
};

type PaginatedUsers = {
  users: User[];
  total: number;
  pages: number;
  current_page: number;
};

export default function UsersTable() {
  const [users, setUsers] = useState<PaginatedUsers>({
    users: [],
    total: 0,
    pages: 0,
    current_page: 1,
  });
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("");
  const [verified, setVerified] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

 
  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    let url = `${backend}/users`;
    const params = new URLSearchParams();

    if (role) params.append("role", role);
    if (verified) params.append("is_verified", verified);

    if (params.toString()) url += `?${params.toString()}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const fetchHostels = async () => {
    try {
      const res = await fetch(`${backend}/hostels`);
      const data = await res.json();
      setHostels(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHostels();
  }, [role, verified]);

 
  const handleUpdate = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`${backend}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          course: selectedUser.course,
          year: selectedUser.year,
          hostel_id: selectedUser.hostel_id,
          room: selectedUser.room_number,
        }),
      });

      setShowEdit(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

 
  const handleVerify = async (id: number, status: boolean) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${backend}/users/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_verified: status,
        }),
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">

    
      <div className="flex gap-4">
        <select
          className="border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="warden">Warden</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={verified}
          onChange={(e) => setVerified(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>
      </div>

   
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">S.No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : (
              users.users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>

                  <td className="p-3">
                    {user.is_verified ? "Approved" : "Pending"}
                  </td>

                  <td className="p-3 flex gap-2">

                   
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEdit(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>

                  
                    <button
                      onClick={() =>
                        handleVerify(user.id, !user.is_verified)
                      }
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      {user.is_verified ? "Block" : "Approve"}
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

   
      {showEdit && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-3">

            <h2 className="text-lg font-bold">Edit User</h2>

            <input
              className="border p-2 w-full"
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              className="border p-2 w-full"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              placeholder="Email"
            />

            <input
              className="border p-2 w-full"
              value={selectedUser.phone || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
              placeholder="Phone"
            />

            <input
              className="border p-2 w-full"
              value={selectedUser.course || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, course: e.target.value })
              }
              placeholder="Course"
            />

            <input
              className="border p-2 w-full"
              value={selectedUser.year || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, year: e.target.value })
              }
              placeholder="Year"
            />

       
            <select
              className="border p-2 w-full"
              value={selectedUser.hostel_id || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  hostel_id: Number(e.target.value),
                })
              }
            >
              <option value="">Select Hostel</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>

            <input
              className="border p-2 w-full"
              value={selectedUser.room_number || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  room_number: e.target.value,
                })
              }
              placeholder="Room Number"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
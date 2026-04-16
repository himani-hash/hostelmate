"use client";

import React from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
};

export default function UsersTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [role, setRole] = React.useState("");
  const [verified, setVerified] = React.useState("");

  const fetchUsers = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;

    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (verified) params.append("is_verified", verified);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

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

  React.useEffect(() => {
    fetchUsers();
  }, [role, verified]);

  return (
    <div className="p-4 space-y-4">

      <div className="flex gap-4 flex-wrap">
        
        <select
          className="border rounded-lg p-2 bg-white dark:bg-gray-800"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="warden">Warden</option>
        </select>

        <select
          className="border rounded-lg p-2 bg-white dark:bg-gray-800"
          value={verified}
          onChange={(e) => setVerified(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.is_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.is_verified ? "Approved" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
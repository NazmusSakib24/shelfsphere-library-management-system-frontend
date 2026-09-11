"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Search } from "lucide-react";

import {
  getUsers,
  type User,
} from "@/services/users";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.fullName} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole =
      role === "all" ||
      user.role.toLowerCase() === role;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Users
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search users by name or email"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-lg border bg-white py-2 pl-9 pr-3 outline-none"
            />
          </div>

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="rounded-lg border bg-white px-3 py-2"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="member">Member</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4">
                User
              </th>

              <th className="text-left p-4">
                Role
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t"
              >
                <td className="p-4">
                  {user.fullName}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  <button
                    type="button"
                    className="p-2"
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
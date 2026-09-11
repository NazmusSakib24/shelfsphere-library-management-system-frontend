"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Plus, Search } from "lucide-react";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type User,
} from "@/services/users";

const createUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "LIBRARIAN", "MEMBER"]),
});

const updateUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "LIBRARIAN", "MEMBER"]),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "MEMBER",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

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

  const handleAddUser = async (data: CreateUserFormData) => {
    try {
      const newUser = await createUser(data);

      setUsers((currentUsers) => [
        ...currentUsers,
        newUser,
      ]);

      resetCreate();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setOpenMenu(null);

    resetUpdate({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
  };

  const handleUpdateUser = async (data: UpdateUserFormData) => {
    if (!editingUser) {
      return;
    }

    try {
      const updatedUser = await updateUser(
        editingUser.id,
        data,
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUser.id
            ? updatedUser
            : user,
        ),
      );

      resetUpdate();
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(id);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== id),
      );

      setOpenMenu(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">
            Users
          </h1>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white"
          >
            <Plus className="size-4" />
            Add User
          </button>
        </div>

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

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Add User
          </h2>

          <form
            onSubmit={handleCreateSubmit(handleAddUser)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                {...registerCreate("fullName")}
                className="w-full rounded-lg border px-3 py-2 outline-none"
                placeholder="Enter full name"
              />

              {createErrors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {createErrors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                {...registerCreate("email")}
                className="w-full rounded-lg border px-3 py-2 outline-none"
                placeholder="Enter email"
              />

              {createErrors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {createErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                {...registerCreate("password")}
                className="w-full rounded-lg border px-3 py-2 outline-none"
                placeholder="Enter password"
              />

              {createErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {createErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone
              </label>

              <input
                type="text"
                {...registerCreate("phone")}
                className="w-full rounded-lg border px-3 py-2 outline-none"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Role
              </label>

              <select
                {...registerCreate("role")}
                className="w-full rounded-lg border bg-white px-3 py-2 outline-none"
              >
                <option value="MEMBER">Member</option>
                <option value="LIBRARIAN">
                  Librarian
                </option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetCreate();
                  setShowForm(false);
                }}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-4 py-2 text-white"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      )}

      {editingUser && (
        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Edit User
          </h2>

          <form
            onSubmit={handleUpdateSubmit(handleUpdateUser)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                {...registerUpdate("fullName")}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />

              {updateErrors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {updateErrors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                {...registerUpdate("email")}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />

              {updateErrors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {updateErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone
              </label>

              <input
                type="text"
                {...registerUpdate("phone")}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Role
              </label>

              <select
                {...registerUpdate("role")}
                className="w-full rounded-lg border bg-white px-3 py-2 outline-none"
              >
                <option value="MEMBER">Member</option>
                <option value="LIBRARIAN">
                  Librarian
                </option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetUpdate();
                  setEditingUser(null);
                }}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-4 py-2 text-white"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      )}

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

                <td className="relative p-4">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === user.id
                          ? null
                          : user.id,
                      )
                    }
                    className="p-2"
                  >
                    <MoreVertical className="size-4" />
                  </button>

                  {openMenu === user.id && (
                    <div className="absolute right-4 top-12 z-10 w-32 rounded-lg border bg-white shadow-md">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditUser(user)
                        }
                        className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteUser(user.id)
                        }
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
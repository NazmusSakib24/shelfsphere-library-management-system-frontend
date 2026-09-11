"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";
import { z } from "zod";
import {createUser,getUsers,type User,} from "@/services/users";
import { CgPassword } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
	fullName: z
	.string()
	.min(2,"Full name is required"),

	email: z
	.string()
	.email("Enter a valid email address"),

	password: z
	.string()
	.min(6,"Password must be at least 6 characters"),

	phone: z
	.string()
	.optional(),

	role: z.enum([
		"ADMIN",
		"LIBRARIAN",
		"MEMBER",
	]),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const{register,handleSubmit,reset,formState: {errors},} = useForm<UserFormData>({
	resolver:zodResolver(userSchema),
	defaultValues:{
		fullName:"",
		email:"",
		password:"",
		phone:"",
		role:"MEMBER",
	}
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


  const handleAddUser = async (data: UserFormData) => {
	try{
		const newUser = await createUser(data);

		setUsers((currentUsers)=>[
			...currentUsers,
			newUser,
		]);

		reset();
		setShowForm(false);
	}
	catch(error){
		console.error("Failed to add new user", error);
	}
  };

  if(loading){
	return <div>Loading users...</div>
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

		<button type="button" onClick={()=>setShowForm(true)} className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white">
			<Plus className="size-4"/>Add User
		</button>

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

				<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(handleAddUser)}>
					<div>
						<label className="mb-1 block text-sm font-medium">Full Name</label>
						<input
							type="text"
							{...register("fullName")}
							className="w-full rounded-lg border px-3 py-2 outline-none"
							placeholder="Enter full name"
						/>

						{errors.fullName &&(
							<p className="mt-1 text-sm text-red-500">
								{errors.fullName.message}
							</p>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">Email</label>
						<input
							type="email"
							{...register("email")}
							className="w-full rounded-lg border px-3 py-2 outline-none"
							placeholder="Enter email"
						/>

						{errors.email &&(
							<p className="mt-1 text-sm text-red-500">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">Password</label>
						<input
						type="password"
						{...register("password")}
						className="w-full rounded-lg border px-3 py-2 outline-none"
						placeholder="Enter password"
						/>

						{errors.password &&(
							<p className="mt-1 text-sm text-red-500">
								{errors.password.message}
							</p>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">
						Phone
						</label>
						<input
						type="text"
						{...register("phone")}
						className="w-full rounded-lg border px-3 py-2 outline-none"
						placeholder="Enter phone number"
						/>

						{errors.phone &&(
							<p className="mt-1 text-sm text-red-500">
								{errors.phone.message}
							</p>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">
						Role
						</label>
						<select
						{...register("role")}
						className="w-full rounded-lg border bg-white px-3 py-2 outline-none"
						>
						<option value="MEMBER">Member</option>
						<option value="LIBRARIAN">Librarian</option>
						<option value="ADMIN">Admin</option>
						</select>
					</div>

					<div className="flex items-end gap-3">
						<button
							type="button"
							onClick={() => setShowForm(false)}
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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Users,
  Trash2,
  Power,
  Pencil,
  RefreshCw,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;

  company?: {
    id: string;
    name: string;
  } | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load users"
        );
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(user: User) {
    try {
      setActionLoading(user.id);
      setError("");

      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !user.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update user status"
        );
        return;
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      setError(
        "Failed to update user status."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(user: User) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${user.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);
      setError("");

      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to delete user"
        );
        return;
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      setError("Failed to delete user.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
            <Users size={30} />

            Users Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage KSTS system users and access.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadUsers}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={17} />

            Refresh
          </button>

          <Link
            href="/admin/users/add"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            <UserPlus size={18} />

            Add User
          </Link>

        </div>

      </div>


      {/* Error */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}


      {/* Users Table */}

      <div className="overflow-hidden rounded-xl bg-white shadow">

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">

            <Users
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-semibold text-slate-700">
              No users found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first system user.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-4 text-left text-sm font-semibold">
                    Name
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Email
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Role
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Company
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => {

                  const isLoading =
                    actionLoading === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-slate-50"
                    >

                      {/* Name */}

                      <td className="p-4">

                        <div className="font-semibold text-slate-900">
                          {user.name}
                        </div>

                      </td>


                      {/* Email */}

                      <td className="p-4 text-slate-600">
                        {user.email}
                      </td>


                      {/* Role */}

                      <td className="p-4">

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {user.role}
                        </span>

                      </td>


                      {/* Company */}

                      <td className="p-4 text-slate-600">
                        {user.company?.name || "-"}
                      </td>


                      {/* Status */}

                      <td className="p-4">

                        {user.isActive ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Inactive
                          </span>
                        )}

                      </td>


                      {/* Actions */}

                      <td className="p-4">

                        <div className="flex items-center gap-2">

                          {/* Edit */}

                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            <Pencil size={15} />

                            Edit
                          </Link>


                          {/* Active / Inactive */}

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                              toggleStatus(user)
                            }
                            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isActive
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >

                            <Power size={15} />

                            {user.isActive
                              ? "Disable"
                              : "Enable"}

                          </button>


                          {/* Delete */}

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                              deleteUser(user)
                            }
                            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <Trash2 size={15} />

                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}
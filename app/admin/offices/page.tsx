"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
}

interface Office {
  id: string;
  name: string;
  code: string;
  city: string;
  address?: string | null;
  phone?: string | null;
  status: "ACTIVE" | "INACTIVE";
  company: Company;
}

export default function OfficesPage() {
  const router = useRouter();

  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadOffices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/offices", {
        cache: "no-store",
        credentials: "include", // agar cookies se auth hai
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load offices");
        return;
      }

      setOffices(data.offices || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load offices. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOffices();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this office? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`/api/admin/offices/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete office");
        return;
      }

      // Optimistic update (optional)
      setOffices((prev) => prev.filter((o) => o.id !== id));
      // ya phir await loadOffices();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the office.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
            <Building2 size={30} />
            Office Management
          </h1>
          <p className="mt-1 text-slate-500">
            Manage KSTS and partner company offices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadOffices}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/offices/add")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Office
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-slate-500">
            <Loader2 className="animate-spin" size={20} />
            Loading offices...
          </div>
        ) : offices.length === 0 ? (
          <div className="p-10 text-center">
            <Building2 size={42} className="mx-auto text-slate-300" />
            <h2 className="mt-3 text-lg font-semibold text-slate-800">
              No offices found
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create your first office to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Office
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {offices.map((office) => (
                  <tr key={office.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {office.name}
                      </div>
                      {office.address && (
                        <div className="mt-1 text-xs text-slate-500">
                          {office.address}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {office.code}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {office.city}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {office.company?.name || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {office.phone || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {office.status === "ACTIVE" ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/admin/offices/${office.id}/edit`)
                          }
                          className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50"
                          title="Edit Office"
                          aria-label="Edit Office"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(office.id)}
                          disabled={deletingId === office.id}
                          className="rounded-lg border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          title="Delete Office"
                          aria-label="Delete Office"
                        >
                          {deletingId === office.id ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bus,
  Plus,
  RefreshCw,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

interface BusData {
  id: string;
  name: string;
  registrationNumber: string;
  busType: string;
  totalSeats: number;
  status: string;
  company?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    seats: number;
  };
}

export default function BusesPage() {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBuses();
  }, []);

  async function loadBuses() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/buses", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load buses");
        return;
      }

      setBuses(data.buses || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load buses.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(bus: BusData) {
    try {
      setActionLoading(bus.id);
      setError("");

      const response = await fetch(`/api/admin/buses/${bus.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: bus.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update bus status");
        return;
      }

      await loadBuses();
    } catch (error) {
      console.error(error);
      setError("Failed to update bus status.");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteBus(bus: BusData) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${bus.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(bus.id);
      setError("");

      const response = await fetch(`/api/admin/buses/${bus.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete bus");
        return;
      }

      await loadBuses();
    } catch (error) {
      console.error(error);
      setError("Failed to delete bus.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
            <Bus size={30} />
            Bus Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage transport buses and fleet information.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadBuses}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            href="/admin/buses/add"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Bus
          </Link>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl bg-white shadow">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading buses...
          </div>
        ) : buses.length === 0 ? (
          <div className="p-8 text-center">
            <Bus
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-semibold text-slate-700">
              No buses found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add your first bus to the fleet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">
                    Bus
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Registration
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Company
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Type
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Seats
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
                {buses.map((bus) => {
                  const isLoading = actionLoading === bus.id;

                  return (
                    <tr
                      key={bus.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">
                          {bus.name}
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">
                        {bus.registrationNumber}
                      </td>

                      <td className="p-4 text-slate-600">
                        {bus.company?.name || "-"}
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {bus.busType}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600">
                        {bus._count?.seats || 0} / {bus.totalSeats}
                      </td>

                      <td className="p-4">
                        {bus.status === "ACTIVE" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/buses/${bus.id}/edit`}
                            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            <Pencil size={15} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => toggleStatus(bus)}
                            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                              bus.status === "ACTIVE"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            <Power size={15} />

                            {bus.status === "ACTIVE"
                              ? "Disable"
                              : "Enable"}
                          </button>

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => deleteBus(bus)}
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
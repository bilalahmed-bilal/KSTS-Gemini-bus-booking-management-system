"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface Company {
  id: string;
  name: string;
  status: string;
}

interface BusData {
  id: string;
  name: string;
  registrationNumber: string;
  busType: string;
  totalSeats: number;
  status: string;
  companyId: string;
  seatClass: string;
  seatLayoutType: string;
}

export default function EditBusPage() {
  const params = useParams();
  const router = useRouter();

  const busId = params.id as string;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    registrationNumber: "",
    busType: "STANDARD",
    totalSeats: "40",
    companyId: "",
    status: "ACTIVE",

    // New seat configuration
    seatClass: "EXECUTIVE",
    seatLayoutType: "TWO_BY_TWO",
  });

  useEffect(() => {
    if (!busId) return;

    loadData();
  }, [busId]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [busResponse, companiesResponse] =
        await Promise.all([
          fetch(`/api/admin/buses/${busId}`, {
            cache: "no-store",
          }),

          fetch("/api/admin/companies", {
            cache: "no-store",
          }),
        ]);

      const busData = await busResponse.json();
      const companiesData =
        await companiesResponse.json();

      if (!busResponse.ok) {
        setError(
          busData.message ||
            "Failed to load bus."
        );
        return;
      }

      if (!companiesResponse.ok) {
        setError(
          companiesData.message ||
            "Failed to load companies."
        );
        return;
      }

      const bus: BusData = busData.bus;

      const activeCompanies =
        (companiesData.companies || []).filter(
          (company: Company) =>
            company.status === "ACTIVE" ||
            company.id === bus.companyId
        );

      setCompanies(activeCompanies);

      setForm({
        name: bus.name || "",
        registrationNumber:
          bus.registrationNumber || "",
        busType:
          bus.busType || "STANDARD",
        totalSeats: String(
          bus.totalSeats || 40
        ),
        companyId:
          bus.companyId || "",
        status:
          bus.status || "ACTIVE",

        seatClass:
          bus.seatClass || "EXECUTIVE",

        seatLayoutType:
          bus.seatLayoutType ||
          (
            bus.seatClass === "EXECUTIVE"
              ? "TWO_BY_TWO"
              : "ONE_BY_TWO"
          ),
      });
    } catch (error) {
      console.error(
        "EDIT BUS LOAD ERROR:",
        error
      );

      setError(
        "Failed to load bus information."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Automatically select physical layout
    // according to seat class.
    if (name === "seatClass") {
      setForm((previous) => ({
        ...previous,
        seatClass: value,
        seatLayoutType:
          value === "EXECUTIVE"
            ? "TWO_BY_TWO"
            : "ONE_BY_TWO",
      }));
    }
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.companyId) {
        setError(
          "Please select a company."
        );
        return;
      }

      const totalSeats = Number(
        form.totalSeats
      );

      if (
        !Number.isInteger(totalSeats) ||
        totalSeats <= 0
      ) {
        setError(
          "Total seats must be a valid positive number."
        );
        return;
      }

      const response = await fetch(
        `/api/admin/buses/${busId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),

            registrationNumber:
              form.registrationNumber.trim(),

            busType:
              form.busType,

            totalSeats,

            companyId:
              form.companyId,

            status:
              form.status,

            seatClass:
              form.seatClass,

            seatLayoutType:
              form.seatLayoutType,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update bus."
        );
        return;
      }

      setSuccess(
        "Bus updated successfully."
      );

      setTimeout(() => {
        router.push(
          "/admin/buses"
        );

        router.refresh();
      }, 700);
    } catch (error) {
      console.error(
        "UPDATE BUS ERROR:",
        error
      );

      setError(
        "Failed to update bus."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">
          Loading bus information...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}

      <div className="mb-6">
        <Link
          href="/admin/buses"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Buses
        </Link>

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
            <Bus size={30} />
            Edit Bus
          </h1>

          <p className="mt-1 text-slate-500">
            Update bus and seat configuration.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      {/* Form */}

      <div className="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Company */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Company
            </label>

            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              required
            >
              <option value="">
                Select Company
              </option>

              {companies.map(
                (company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                )
              )}
            </select>

            {companies.length === 0 && (
              <p className="mt-2 text-sm text-red-600">
                No companies found.
              </p>
            )}
          </div>

          {/* Bus Name */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bus Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Executive Bus 01"
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Registration Number */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Registration Number
            </label>

            <input
              type="text"
              name="registrationNumber"
              value={
                form.registrationNumber
              }
              onChange={handleChange}
              placeholder="e.g. KSTS-002"
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 uppercase outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Bus Type */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Bus Type
            </label>

            <select
              name="busType"
              value={form.busType}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="STANDARD">
                Standard
              </option>

              <option value="EXECUTIVE">
                Executive
              </option>

              <option value="SLEEPER">
                Sleeper
              </option>

              <option value="FAMILY">
                Family
              </option>

              <option value="LUXURY">
                Luxury
              </option>
            </select>
          </div>

          {/* Seat Class */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Seat Class
            </label>

            <select
              name="seatClass"
              value={form.seatClass}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="EXECUTIVE">
                AC Standard Executive
              </option>

              <option value="BUSINESS">
                AC Standard Business
              </option>

              <option value="SLEEPER">
                AC Standard Sleeper
              </option>
            </select>
          </div>

          {/* Automatically selected layout */}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Seat Layout
            </p>

            <p className="mt-1 text-sm text-blue-700">
              {form.seatClass ===
              "EXECUTIVE"
                ? "2 × 2 — Two seats on each side"
                : "1 × 2 — One seat/bed on one side and two on the other side, with a walking gap"}
            </p>

            {form.seatClass ===
              "SLEEPER" && (
              <p className="mt-2 text-xs text-blue-600">
                Sleeper will use Upper/Lower
                beds with grouped 6-bed sections.
              </p>
            )}
          </div>

          {/* Total Seats */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Total Seats / Beds
            </label>

            <input
              type="number"
              name="totalSeats"
              value={form.totalSeats}
              onChange={handleChange}
              min="1"
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Link
              href="/admin/buses"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Updating..."
                : "Update Bus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


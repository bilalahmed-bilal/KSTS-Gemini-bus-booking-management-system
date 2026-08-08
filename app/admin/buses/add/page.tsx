"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bus } from "lucide-react";

interface Company {
  id: string;
  name: string;
  status: string;
}

export default function AddBusPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    busType: "STANDARD",
    seatClass: "EXECUTIVE",
    seatLayoutType: "TWO_BY_TWO",
    totalSeats: "40",
    companyId: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      setLoadingCompanies(true);

      const response = await fetch(
        "/api/admin/companies",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load companies."
        );
        return;
      }

      const activeCompanies =
        (data.companies || []).filter(
          (company: Company) =>
            company.status === "ACTIVE"
        );

      setCompanies(activeCompanies);

      if (activeCompanies.length > 0) {
        setForm((previous) => ({
          ...previous,
          companyId:
            previous.companyId ||
            activeCompanies[0].id,
        }));
      }
    } catch (error) {
      console.error(error);
      setError(
        "Failed to load companies."
      );
    } finally {
      setLoadingCompanies(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
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

      const response = await fetch(
        "/api/admin/buses",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            busType: form.busType,
            seatClass:
              form.seatClass,
            seatLayoutType:
              form.seatLayoutType,
            totalSeats:
              Number(form.totalSeats),
            companyId:
              form.companyId,
            status:
              form.status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create bus."
        );
        return;
      }

      setSuccess(
        "Bus created successfully."
      );

      setForm((previous) => ({
        ...previous,
        busType: "STANDARD",
        seatClass: "EXECUTIVE",
        seatLayoutType:
          "TWO_BY_TWO",
        totalSeats: "40",
      }));
    } catch (error) {
      console.error(error);
      setError(
        "Failed to create bus."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
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
            Add Bus
          </h1>

          <p className="mt-1 text-slate-500">
            Add a new bus to a transport company.
          </p>
        </div>
      </div>

      {/* Messages */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

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
              disabled={
                loadingCompanies ||
                saving
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              required
            >
              <option value="">
                {loadingCompanies
                  ? "Loading companies..."
                  : "Select Company"}
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

            {!loadingCompanies &&
              companies.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  No active companies found.
                </p>
              )}
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

          {/* Seat Class + Layout */}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Seat Class
              </label>

              <select
                name="seatClass"
                value={
                  form.seatClass
                }
                onChange={
                  handleChange
                }
                disabled={saving}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="EXECUTIVE">
                  Executive
                </option>

                <option value="BUSINESS">
                  Business
                </option>

                <option value="SLEEPER">
                  Sleeper
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Seat Layout
              </label>

              <select
                name="seatLayoutType"
                value={
                  form.seatLayoutType
                }
                onChange={
                  handleChange
                }
                disabled={saving}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="TWO_BY_TWO">
                  2 × 2
                </option>

                <option value="ONE_BY_TWO">
                  1 × 2
                </option>

                <option value="SLEEPER">
                  Sleeper
                </option>
              </select>
            </div>
          </div>

          {/* Total Seats */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Total Seats / Beds
            </label>

            <input
              type="number"
              name="totalSeats"
              value={
                form.totalSeats
              }
              onChange={
                handleChange
              }
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
              onChange={
                handleChange
              }
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
              disabled={
                saving ||
                loadingCompanies
              }
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Bus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
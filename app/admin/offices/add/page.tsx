"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
Building2,
ArrowLeft,
Save,
Loader2,
} from "lucide-react";

interface Company {
id: string;
name: string;
}

export default function AddOfficePage() {
const router = useRouter();

const [companies, setCompanies] = useState<Company[]>([]);
const [loadingCompanies, setLoadingCompanies] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

const [form, setForm] = useState({
name: "",
code: "",
city: "",
address: "",
phone: "",
companyId: "",
status: "ACTIVE",
});

// ==========================================
// LOAD COMPANIES
// ==========================================

useEffect(() => {
loadCompanies();
}, []);

async function loadCompanies() {
try {
setLoadingCompanies(true);
setError("");
  const response = await fetch("/api/admin/companies", {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.message || "Failed to load companies"
    );
    return;
  }

  setCompanies(data.companies || []);
} catch (error) {
  console.error(error);
  setError("Failed to load companies.");
} finally {
  setLoadingCompanies(false);
}

}

// ==========================================
// HANDLE INPUT
// ==========================================

function handleChange(
e: React.ChangeEvent<
HTMLInputElement | HTMLSelectElement
>
) {
const { name, value } = e.target;

setForm((previous) => ({
  ...previous,
  [name]: value,
}));

}

// ==========================================
// SUBMIT
// ==========================================

async function handleSubmit(
e: React.FormEvent
) {
e.preventDefault();

setError("");

if (!form.name.trim()) {
  setError("Office name is required.");
  return;
}

if (!form.code.trim()) {
  setError("Office code is required.");
  return;
}

if (!form.city.trim()) {
  setError("City is required.");
  return;
}

if (!form.companyId) {
  setError("Please select a company.");
  return;
}

try {
  setSaving(true);

  const response = await fetch(
    "/api/admin/offices",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name.trim(),
        code: form.code
          .trim()
          .toUpperCase(),
        city: form.city.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        companyId: form.companyId,
        status: form.status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.message ||
        "Failed to create office."
    );
    return;
  }

  router.push("/admin/offices");
} catch (error) {
  console.error(error);

  setError(
    "Something went wrong while creating the office."
  );
} finally {
  setSaving(false);
}
}

// ==========================================
// PAGE
// ==========================================

return ( <div>
{/* HEADER */}

  <div className="mb-6 flex items-center justify-between">
    <div>
      <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
        <Building2 size={30} />
        Add Office
      </h1>

      <p className="mt-1 text-slate-500">
        Create a new company office.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        router.push("/admin/offices")
      }
      className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  </div>

  {/* ERROR */}

  {error && (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      {error}
    </div>
  )}

  {/* FORM */}

  <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* OFFICE NAME */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Office Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Karachi Main Office"
          required
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* OFFICE CODE */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Office Code
        </label>

        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="e.g. KHI01"
          required
          className="w-full rounded-lg border border-slate-300 p-3 uppercase outline-none focus:border-blue-500"
        />

        <p className="mt-1 text-xs text-slate-500">
          Use a unique short code for this company's office.
        </p>
      </div>

      {/* CITY */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          City
        </label>

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="e.g. Karachi"
          required
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* ADDRESS */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Address
        </label>

        <textarea
          name="address"
          value={form.address}
          onChange={(e) =>
            setForm((previous) => ({
              ...previous,
              address: e.target.value,
            }))
          }
          placeholder="Enter complete office address"
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* PHONE */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone
        </label>

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. 021-12345678"
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* COMPANY */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Company
        </label>

        <select
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
          required
          disabled={loadingCompanies}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">
            {loadingCompanies
              ? "Loading companies..."
              : "Select company"}
          </option>

          {companies.map((company) => (
            <option
              key={company.id}
              value={company.id}
            >
              {company.name}
            </option>
          ))}
        </select>

        {!loadingCompanies &&
          companies.length === 0 && (
            <p className="mt-1 text-xs text-red-600">
              No companies found. Please create a company first.
            </p>
          )}
      </div>

      {/* STATUS */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Office Status
        </label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500"
        >
          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>
      </div>

      {/* BUTTONS */}

      <div className="flex gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={
            saving ||
            loadingCompanies ||
            companies.length === 0
          }
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Creating...
            </>
          ) : (
            <>
              <Save size={18} />
              Create Office
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/offices")
          }
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>

);
}

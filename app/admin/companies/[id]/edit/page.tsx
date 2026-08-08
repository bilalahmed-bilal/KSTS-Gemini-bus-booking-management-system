"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    logo: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadCompany();
    }
  }, [id]);

  async function loadCompany() {
    try {
      const response = await fetch(`/api/admin/companies/${id}`);

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load company");
        return;
      }

      setForm({
        name: data.company?.name || "",
        phone: data.company?.phone || "",
        email: data.company?.email || "",
        address: data.company?.address || "",
        logo: data.company?.logo || "",
        status: data.company?.status || "ACTIVE",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while loading company.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update company");
        return;
      }

      alert("Company updated successfully.");

      router.push("/admin/companies");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Building2 />
          Edit Company
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Company Name"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Phone"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Email"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Address"
          />

          <input
            name="logo"
            value={form.logo}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Logo URL"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Company"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/companies")}
              className="border px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
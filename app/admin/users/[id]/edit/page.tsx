"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  UserRound,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  companyId?: string | null;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [companies, setCompanies] = useState<Company[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "COMPANY_ADMIN",
    companyId: "",
    isActive: true,
  });


  // ==========================================
  // LOAD USER + COMPANIES
  // ==========================================

  useEffect(() => {
    if (id) {
      loadUser();
      loadCompanies();
    }
  }, [id]);


  // ==========================================
  // LOAD USER
  // ==========================================

  async function loadUser() {
    try {
      setError("");

      const response = await fetch(
        `/api/admin/users/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load user"
        );

        return;
      }

      const user: UserData = data.user;

      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role:
          user.role ||
          "COMPANY_ADMIN",
        companyId:
          user.companyId || "",
        isActive:
          user.isActive ?? true,
      });
    } catch (error) {
      console.error(error);

      setError(
        "Failed to load user."
      );
    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // LOAD COMPANIES
  // ==========================================

  async function loadCompanies() {
    try {
      const response = await fetch(
        "/api/admin/companies",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setCompanies(
          data.companies || []
        );
      }
    } catch (error) {
      console.error(error);
    }
  }


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } =
      e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


  // ==========================================
  // HANDLE STATUS
  // ==========================================

  function handleStatusChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    setForm((previous) => ({
      ...previous,
      isActive:
        e.target.value === "true",
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


    // ------------------------------------------
    // PASSWORD MATCH CHECK
    // ------------------------------------------

    if (
      form.password &&
      form.password !==
        form.confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );

      return;
    }


    // ------------------------------------------
    // PASSWORD LENGTH
    // ------------------------------------------

    if (
      form.password &&
      form.password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }


    setSaving(true);


    try {
      const response = await fetch(
        `/api/admin/users/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,

            // Empty password will keep
            // existing password unchanged.
            password:
              form.password || "",

            role: form.role,

            companyId:
              form.companyId || null,

            isActive:
              form.isActive,
          }),
        }
      );

      const data =
        await response.json();


      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update user"
        );

        return;
      }


      // Successfully updated
      router.push("/admin/users");
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-semibold text-slate-600">
          Loading user...
        </p>
      </div>
    );
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">

            <UserRound size={30} />

            Edit User

          </h1>

          <p className="mt-1 text-slate-500">
            Update user account information.
          </p>
        </div>


        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/users"
            )
          }
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />

          Back
        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}


      {/* ======================================
          FORM
      ====================================== */}

      <div className="max-w-2xl rounded-xl bg-white p-6 shadow">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          {/* ==================================
              NAME
          ================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* ==================================
              EMAIL
          ================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

          </div>


          {/* ==================================
              NEW PASSWORD
          ================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              New Password
            </label>

            <div className="relative">

              <input
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-slate-300 p-3 pr-12 outline-none focus:border-blue-500"
              />


              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              Leave blank to keep the current password.
            </p>

          </div>


          {/* ==================================
              CONFIRM NEW PASSWORD
          ================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>

            <div className="relative">

              <input
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  form.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`w-full rounded-lg border p-3 pr-12 outline-none focus:border-blue-500 ${
                  form.confirmPassword &&
                  form.password !==
                    form.confirmPassword
                    ? "border-red-400"
                    : "border-slate-300"
                }`}
              />


              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>


            {form.confirmPassword &&
              form.password !==
                form.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match.
                </p>
              )}

            {form.confirmPassword &&
              form.password ===
                form.confirmPassword && (
                <p className="mt-1 text-xs text-green-600">
                  Passwords match.
                </p>
              )}

          </div>


          {/* ==================================
              ROLE
          ================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            >

              <option value="SUPER_ADMIN">
                Super Admin
              </option>

              <option value="COMPANY_ADMIN">
                Company Admin
              </option>

              <option value="OFFICE_MANAGER">
                Office Manager
              </option>

              <option value="OFFICE_STAFF">
                Office Staff
              </option>

            </select>

          </div>


          {/* ==================================
              COMPANY
          ================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Company
            </label>

            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            >

              <option value="">
                System / No Company
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

          </div>


          {/* ==================================
              STATUS
          ================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Status
            </label>

            <select
              value={
                form.isActive
                  ? "true"
                  : "false"
              }
              onChange={
                handleStatusChange
              }
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            >

              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>

            </select>

          </div>


          {/* ==================================
              BUTTONS
          ================================== */}

          <div className="flex gap-3 pt-3">

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/users"
                )
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
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Building2,
//   ArrowLeft,
//   Save,
//   Loader2,
// } from "lucide-react";

// interface Company {
//   id: string;
//   name: string;
// }

// interface OfficeData {
//   id: string;
//   name: string;
//   code: string;
//   city: string;
//   address?: string | null;
//   phone?: string | null;
//   status: "ACTIVE" | "INACTIVE";
//   companyId: string;
//   company?: Company;
// }

// export default function EditOfficePage() {
//   const params = useParams();
//   const router = useRouter();

//   const id = params.id as string;

//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingCompanies, setLoadingCompanies] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     code: "",
//     city: "",
//     address: "",
//     phone: "",
//     companyId: "",
//     status: "ACTIVE",
//   });

//   useEffect(() => {
//     if (id) {
//       loadOffice();
//       loadCompanies();
//     }
//   }, [id]);

//   async function loadOffice() {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `/api/admin/offices/${id}`,
//         {
//           cache: "no-store",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(
//           data.message || "Failed to load office"
//         );
//         return;
//       }

//       const office: OfficeData = data.office;

//       setForm({
//         name: office.name || "",
//         code: office.code || "",
//         city: office.city || "",
//         address: office.address || "",
//         phone: office.phone || "",
//         companyId: office.companyId || "",
//         status: office.status || "ACTIVE",
//       });
//     } catch (error) {
//       console.error(error);
//       setError("Failed to load office.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function loadCompanies() {
//     try {
//       setLoadingCompanies(true);

//       const response = await fetch(
//         "/api/admin/companies",
//         {
//           cache: "no-store",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Failed to load companies"
//         );
//         return;
//       }

//       setCompanies(data.companies || []);
//     } catch (error) {
//       console.error(error);
//       setError("Failed to load companies.");
//     } finally {
//       setLoadingCompanies(false);
//     }
//   }

//   function handleChange(
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement
//     >
//   ) {
//     const { name, value } = e.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   }

//   async function handleSubmit(
//     e: React.FormEvent
//   ) {
//     e.preventDefault();

//     setError("");

//     if (!form.name.trim()) {
//       setError("Office name is required.");
//       return;
//     }

//     if (!form.code.trim()) {
//       setError("Office code is required.");
//       return;
//     }

//     if (!form.city.trim()) {
//       setError("City is required.");
//       return;
//     }

//     if (!form.companyId) {
//       setError("Please select a company.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const response = await fetch(
//         `/api/admin/offices/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify({
//             name: form.name.trim(),
//             code: form.code
//               .trim()
//               .toUpperCase(),
//             city: form.city.trim(),
//             address:
//               form.address.trim(),
//             phone:
//               form.phone.trim(),
//             companyId:
//               form.companyId,
//             status:
//               form.status,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Failed to update office."
//         );
//         return;
//       }

//       router.push("/admin/offices");
//     } catch (error) {
//       console.error(error);

//       setError(
//         "Something went wrong while updating the office."
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-10 text-slate-500">
//         <Loader2
//           size={22}
//           className="mr-2 animate-spin"
//         />
//         Loading office...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
//             <Building2 size={30} />
//             Edit Office
//           </h1>

//           <p className="mt-1 text-slate-500">
//             Update office information.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() =>
//             router.push("/admin/offices")
//           }
//           className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
//         >
//           <ArrowLeft size={18} />
//           Back
//         </button>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >
//           <div>
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Office Name
//             </label>

//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Office Code
//             </label>

//             <input
//               name="code"
//               value={form.code}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-slate-300 p-3 uppercase outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               City
//             </label>

//             <input
//               name="city"
//               value={form.city}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Address
//             </label>

//             <textarea
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               rows={3}
//               className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Phone
//             </label>

//             <input
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Company
//             </label>

//             <select
//               name="companyId"
//               value={form.companyId}
//               onChange={handleChange}
//               disabled={loadingCompanies}
//               required
//               className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
//             >
//               <option value="">
//                 {loadingCompanies
//                   ? "Loading companies..."
//                   : "Select company"}
//               </option>

//               {companies.map(
//                 (company) => (
//                   <option
//                     key={company.id}
//                     value={company.id}
//                   >
//                     {company.name}
//                   </option>
//                 )
//               )}
//             </select>
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Office Status
//             </label>

//             <select
//               name="status"
//               value={form.status}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500"
//             >
//               <option value="ACTIVE">
//                 Active
//               </option>

//               <option value="INACTIVE">
//                 Inactive
//               </option>
//             </select>
//           </div>

//           <div className="flex gap-3 border-t border-slate-100 pt-5">
//             <button
//               type="submit"
//               disabled={
//                 saving ||
//                 loadingCompanies
//               }
//               className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {saving ? (
//                 <>
//                   <Loader2
//                     size={18}
//                     className="animate-spin"
//                   />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={18} />
//                   Save Changes
//                 </>
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 router.push(
//                   "/admin/offices"
//                 )
//               }
//               className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface OfficeData {
id: string;
name: string;
code: string;
city: string;
address?: string | null;
phone?: string | null;
status: "ACTIVE" | "INACTIVE";
companyId: string;
company?: Company;
}

export default function EditOfficePage() {
const params = useParams();
const router = useRouter();

const id = params.id as string;

const [companies, setCompanies] = useState<Company[]>([]);
const [loading, setLoading] = useState(true);
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

useEffect(() => {
if (id) {
loadOffice();
loadCompanies();
}
}, [id]);

async function loadOffice() {
try {
setLoading(true);
setError("");

  const response = await fetch(
    `/api/admin/offices/${id}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.message ||
        "Failed to load office"
    );
    return;
  }

  const office: OfficeData = data.office;

  setForm({
    name: office.name || "",
    code: office.code || "",
    city: office.city || "",
    address: office.address || "",
    phone: office.phone || "",
    companyId: office.companyId || "",
    status: office.status || "ACTIVE",
  });
} catch (error) {
  console.error(error);
  setError("Failed to load office.");
} finally {
  setLoading(false);
}


}

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
        "Failed to load companies"
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

function handleChange(
e: React.ChangeEvent<
HTMLInputElement |
HTMLSelectElement |
HTMLTextAreaElement
>
) {
const { name, value } = e.target;


setForm((previous) => ({
  ...previous,
  [name]: value,
}));


}

async function handleSubmit(
e: React.FormEvent
) {
e.preventDefault();


setError("");

if (!form.name.trim()) {
  setError(
    "Office name is required."
  );
  return;
}

if (!form.code.trim()) {
  setError(
    "Office code is required."
  );
  return;
}

if (!form.city.trim()) {
  setError("City is required.");
  return;
}

if (!form.companyId) {
  setError(
    "Please select a company."
  );
  return;
}

try {
  setSaving(true);

  const response = await fetch(
    `/api/admin/offices/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name: form.name.trim(),
        code: form.code
          .trim()
          .toUpperCase(),
        city: form.city.trim(),
        address:
          form.address.trim(),
        phone:
          form.phone.trim(),
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
        "Failed to update office."
    );
    return;
  }

  router.push("/admin/offices");
} catch (error) {
  console.error(error);

  setError(
    "Something went wrong while updating the office."
  );
} finally {
  setSaving(false);
}

}

if (loading) {
return ( <div className="flex items-center justify-center p-10 text-slate-500"> <Loader2
       size={22}
       className="mr-2 animate-spin"
     />
Loading office... </div>
);
}

return ( <div> <div className="mb-6 flex items-center justify-between"> <div> <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900"> <Building2 size={30} />
Edit Office </h1>

```
      <p className="mt-1 text-slate-500">
        Update office information.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        router.push(
          "/admin/offices"
        )
      }
      className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  </div>

  {error && (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      {error}
    </div>
  )}

  <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Office Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Office Code
        </label>

        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 p-3 uppercase outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          City
        </label>

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Address
        </label>

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone
        </label>

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Company
        </label>

        <select
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
          disabled={
            loadingCompanies
          }
          required
          className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
        >
          <option value="">
            {loadingCompanies
              ? "Loading companies..."
              : "Select company"}
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

      <div className="flex gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={
            saving ||
            loadingCompanies
          }
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/offices"
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

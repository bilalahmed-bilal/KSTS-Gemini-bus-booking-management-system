// "use client";

// import { UserCircle } from "lucide-react";

// interface DashboardHeaderProps {
// userName?: string;
// userRole?: string;
// }

// export default function DashboardHeader({
// userName = "Admin",
// userRole = "SUPER ADMIN",
// }: DashboardHeaderProps) {
// return ( <header className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">

// ```
//   <div>
//     <h1 className="text-2xl font-bold text-slate-900">
//       KSTS Super Admin Dashboard
//     </h1>

//     <p className="mt-1 text-slate-500">
//       Karachi Smart Travel Services Management System
//     </p>
//   </div>

//   <div className="flex items-center gap-3">

//     <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
//       <UserCircle size={26} />
//     </div>

//     <div>
//       <p className="font-semibold text-slate-900">
//         {userName}
//       </p>

//       <p className="text-sm text-slate-500">
//         {userRole}
//       </p>
//     </div>

//   </div>

// </header>

// );
// }

"use client";

import { UserCircle } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
}

export default function DashboardHeader({
  userName = "Admin",
  userRole = "SUPER ADMIN",
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          KSTS Super Admin Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Karachi Smart Travel Services Management System
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <UserCircle size={26} />
        </div>

        <div>
          <p className="font-semibold text-slate-900">
            {userName}
          </p>

          <p className="text-sm text-slate-500">
            {userRole}
          </p>
        </div>
      </div>
    </header>
  );
}
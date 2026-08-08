// "use client";

// import DashboardHeader from "@/components/dashboard-header";

// export default function DashboardPage() {
// return ( <div className="min-h-screen bg-slate-100 p-6">

// ```
//   <DashboardHeader />

//   <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

//     <h2 className="text-xl font-bold">
//       KSTS Dashboard
//     </h2>

//     <p className="mt-2 text-slate-600">
//       Dashboard Header is working correctly.
//     </p>

//   </div>

// </div>

// );
// }

"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Bus,
  Ticket,
  Users,
  BriefcaseBusiness,
  Map,
  Settings,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard-header";
import StatCard from "@/components/stat-card";

interface DashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  activeUsers: number;
  totalBuses: number;
  totalBookings: number;
}

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    activeCompanies: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalBuses: 0,
    totalBookings: 0,
  });

  const [user, setUser] = useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [statsResponse, userResponse] = await Promise.all([
        fetch("/api/admin/dashboard", {
          cache: "no-store",
        }),

        fetch("/api/auth/me", {
          cache: "no-store",
        }),
      ]);

      const statsData = await statsResponse.json();
      const userData = await userResponse.json();

      if (statsResponse.ok && statsData.stats) {
        setStats(statsData.stats);
      }

      if (userResponse.ok && userData.user) {
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-semibold text-slate-600">
          Loading KSTS Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <DashboardHeader
        userName={user?.name || "Admin"}
        userRole={user?.role || "SUPER ADMIN"}
      />

      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Welcome Back, {user?.name || "Admin"}
        </h2>

        <p className="mt-1 text-slate-500">
          {user?.email || "KSTS Management System"}
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          description={`${stats.activeCompanies} active companies`}
          icon={Building2}
        />

        <StatCard
          title="Total Buses"
          value={stats.totalBuses}
          description="Bus fleet"
          icon={Bus}
        />

        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="All bookings"
          icon={Ticket}
        />

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description={`${stats.activeUsers} active users`}
          icon={Users}
        />
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            KSTS Modules
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage the main areas of the KSTS system.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <Building2 className="text-blue-600" size={28} />

            <h3 className="mt-3 font-semibold text-slate-900">
              Company Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage transport companies.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <BriefcaseBusiness className="text-blue-600" size={28} />

            <h3 className="mt-3 font-semibold text-slate-900">
              Office Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage KSTS and company offices.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <Bus className="text-blue-600" size={28} />

            <h3 className="mt-3 font-semibold text-slate-900">
              Bus Fleet Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage buses and fleet information.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <Map className="text-blue-600" size={28} />

            <h3 className="mt-3 font-semibold text-slate-900">
              Route Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage routes and destinations.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <Ticket className="text-blue-600" size={28} />

            <h3 className="mt-3 font-semibold text-slate-900">
              Booking System
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage tickets and bookings.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <Settings className="text-blue-600" size={28} />

            <h3 className="mt-3 font-semibold text-slate-900">
              System Settings
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Configure system settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
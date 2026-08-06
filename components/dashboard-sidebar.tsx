"use client";

import {
  LayoutDashboard,
  Building2,
  Bus,
  Map,
  Ticket,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Companies",
    icon: Building2,
  },
  {
    title: "Buses",
    icon: Bus,
  },
  {
    title: "Routes",
    icon: Map,
  },
  {
    title: "Bookings",
    icon: Ticket,
  },
  {
    title: "Users",
    icon: Users,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];


export default function DashboardSidebar() {

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">

      {/* Logo */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          KSTS
        </h1>

        <p className="text-sm text-slate-400">
          Smart Travel Services
        </p>

      </div>


      {/* Menu */}

      <nav className="space-y-2">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.title}
              className="
              w-full
              flex
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-left
              hover:bg-slate-800
              transition
              "
            >

              <Icon size={20} />

              <span>
                {item.title}
              </span>

            </button>

          );

        })}


      </nav>


      {/* Logout */}

      <button
        className="
        mt-10
        w-full
        flex
        items-center
        gap-3
        rounded-lg
        px-4
        py-3
        hover:bg-red-600
        transition
        "
      >

        <LogOut size={20}/>

        Logout

      </button>


    </aside>
  );
}
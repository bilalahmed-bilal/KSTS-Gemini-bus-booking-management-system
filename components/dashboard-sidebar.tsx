"use client";

import { useEffect, useState } from "react";
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


interface User {
  name: string;
  email: string;
  role: string;
}



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


  const [user, setUser] = useState<User | null>(null);



  useEffect(() => {

    async function loadUser() {

      try {

        const response = await fetch("/api/auth/me");

        const data = await response.json();


        if (response.ok) {

          setUser(data.user);

        }


      } catch (error) {

        console.error(error);

      }

    }


    loadUser();


  }, []);





  async function handleLogout() {


    try {

      await fetch("/api/auth/logout", {
        method: "POST",
      });


      window.location.href = "/login";


    } catch (error) {

      console.error(error);

    }


  }





  return (

    <aside
      className="
        w-64
        h-screen
        sticky
        top-0
        bg-slate-900
        text-white
        p-5
        flex
        flex-col
      "
    >



      {/* Logo */}

      <div className="mb-6">


        <h1
          className="
            text-4xl
            font-black
            tracking-wider
          "
        >
          KSTS
        </h1>


        <p className="text-sm text-slate-400">
          Smart Travel Services
        </p>


      </div>





      {/* User Profile */}

      <div
        className="
          mb-6
          rounded-xl
          bg-slate-800
          p-4
        "
      >


        <p
          className="
            font-bold
            truncate
          "
        >
          {user?.name || "Loading..."}
        </p>


        <p
          className="
            text-xs
            text-slate-400
            truncate
          "
        >
          {user?.email || ""}
        </p>



        {user?.role && (

          <span
            className="
              inline-block
              mt-3
              rounded-full
              bg-blue-600
              px-3
              py-1
              text-xs
              font-semibold
            "
          >
            {user.role}
          </span>

        )}


      </div>







      {/* Menu */}

      <nav
        className="
          flex-1
          space-y-2
          overflow-y-auto
          pr-1
        "
      >


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
                text-slate-200
                hover:bg-slate-800
                transition
              "

            >

              <Icon size={20}/>

              <span>
                {item.title}
              </span>


            </button>


          );


        })}


      </nav>







      {/* Logout */}

    {/* Logout */}

<div className="mt-4">

  <button
    onClick={handleLogout}
    className="
      w-full
      flex
      items-center
      gap-3
      rounded-lg
      px-4
      py-3
      text-slate-200
      hover:bg-red-600
      transition
    "
  >

    <LogOut size={20}/>

    <span>
      Logout
    </span>

  </button>

</div>




    </aside>

  );


}
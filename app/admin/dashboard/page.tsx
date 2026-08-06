"use client";

import { useEffect, useState } from "react";

import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import StatCard from "@/components/stat-card";

import {
  Building2,
  Bus,
  Ticket,
  Users,
} from "lucide-react";


interface User {

  id: string;
  name: string;
  email: string;
  role: string;

}



export default function DashboardPage() {


  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {


    async function getUser() {


      try {


        const response = await fetch("/api/auth/me");


        const data = await response.json();


        if (response.ok) {

          setUser(data.user);

        }


      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }


    }


    getUser();


  }, []);




  if (loading) {


    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-xl
        font-bold
      ">

        Loading KSTS Dashboard...

      </div>

    );

  }




  return (

    <div className="
      flex
      min-h-screen
      bg-slate-100
    ">



      <DashboardSidebar />



      <main className="
        flex-1
        p-6
      ">


        <DashboardHeader />



        {/* User Welcome Card */}

        <div className="
          mt-6
          rounded-xl
          bg-white
          p-5
          shadow-sm
        ">


          <h1 className="
            text-2xl
            font-bold
          ">

            Welcome Back, {user?.name}

          </h1>


          <p className="
            mt-2
            text-slate-600
          ">

            {user?.email}

          </p>


          <span className="
            inline-block
            mt-3
            rounded-full
            bg-blue-100
            px-4
            py-1
            text-sm
            font-semibold
            text-blue-700
          ">

            {user?.role}

          </span>


        </div>





        {/* Stats */}


        <div className="
          mt-6
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-4
        ">


          <StatCard
            title="Total Companies"
            value="0"
            icon={Building2}
          />


          <StatCard
            title="Total Buses"
            value="0"
            icon={Bus}
          />


          <StatCard
            title="Total Bookings"
            value="0"
            icon={Ticket}
          />


          <StatCard
            title="Total Users"
            value="1"
            icon={Users}
          />


        </div>





        {/* Modules */}


        <div className="
          mt-6
          rounded-xl
          bg-white
          p-6
          shadow-sm
        ">


          <h2 className="
            text-xl
            font-bold
          ">

            KSTS Modules

          </h2>



          <div className="
            mt-4
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          ">


            <div className="rounded-lg bg-slate-100 p-4">
              🏢 Company Management
            </div>


            <div className="rounded-lg bg-slate-100 p-4">
              🏪 Office Management
            </div>


            <div className="rounded-lg bg-slate-100 p-4">
              🚌 Bus Fleet Management
            </div>


            <div className="rounded-lg bg-slate-100 p-4">
              🛣 Route Management
            </div>


            <div className="rounded-lg bg-slate-100 p-4">
              🎫 Booking System
            </div>


            <div className="rounded-lg bg-slate-100 p-4">
              ⚙ System Settings
            </div>


          </div>


        </div>



      </main>


    </div>

  );


}
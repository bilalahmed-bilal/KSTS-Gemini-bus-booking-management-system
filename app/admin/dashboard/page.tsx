import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import StatCard from "@/components/stat-card";

import {
  Building2,
  Bus,
  Ticket,
  Users,
} from "lucide-react";


export default function DashboardPage() {

  return (

    <div className="
      flex
      min-h-screen
      bg-slate-100
    ">


      {/* Sidebar */}

      <DashboardSidebar />



      {/* Main */}

      <main className="
        flex-1
        p-6
      ">


        <DashboardHeader />



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
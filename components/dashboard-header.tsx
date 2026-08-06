"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";


export default function DashboardHeader() {

  return (

    <header className="
      flex
      items-center
      justify-between
      rounded-xl
      bg-white
      p-6
      shadow-sm
    ">


      <div>

        <h1 className="
          text-2xl
          font-bold
          text-slate-900
        ">
          KSTS Super Admin Dashboard
        </h1>


        <p className="
          text-slate-500
          mt-1
        ">
          Karachi Smart Travel Services Management System
        </p>

      </div>



      <div className="
        flex
        items-center
        gap-3
      ">


        <Avatar>

          <AvatarFallback>
            BA
          </AvatarFallback>

        </Avatar>


        <div>

          <p className="
            font-semibold
          ">
            Bilal Ahmed
          </p>


          <p className="
            text-sm
            text-slate-500
          ">
            SUPER ADMIN
          </p>


        </div>


      </div>


    </header>

  );

}
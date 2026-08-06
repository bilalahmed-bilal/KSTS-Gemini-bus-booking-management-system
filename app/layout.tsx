"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeOfficeName, setActiveOfficeName] = useState("Sohrab Goth Terminal");


  useEffect(() => {
    const savedOffice = localStorage.getItem("activeOffice");

    if (savedOffice) {
      const office = JSON.parse(savedOffice);
      setActiveOfficeName(office.name);
    }

  }, [activeModal]);


  return (

    <html 
      lang="en" 
      className={cn("font-sans", geist.variable)}
    >

      <body
        className="
        bg-slate-50
        text-slate-800
        min-h-screen
        flex
        flex-col
        relative
        "
        suppressHydrationWarning
      >


        {/* Header */}

        <header className="
          bg-gradient-to-r
          from-blue-700
          to-indigo-800
          text-white
          shadow-md
        ">

          <div className="
            max-w-7xl
            mx-auto
            px-6
            py-4
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-4
          ">


            <a 
              href="/"
              className="
              flex
              items-center
              justify-center
              md:justify-start
              gap-4
              hover:opacity-90
              transition
              "
            >

              <img
                src="/Hazara-bus-png.png"
                alt="Karachi Smart Travel Services"
                className="
                h-16
                w-auto
                object-contain
                rounded-lg
                bg-white/10
                p-1
                shadow-md
                "
              />


              <div>


                <h1 className="
                  text-3xl
                  font-black
                  tracking-wider
                  leading-none
                ">
                  Karachi Smart Travel Services
                </h1>


              <p className="
  text-base
  md:text-lg
  text-blue-100
  font-semibold
  mt-3
  tracking-wide
">
پاکستان بھر کی بہترین بس سروسز کی بکنگ، ایک ہی چھت تلے
</p>


               <p className="
  text-sm
  md:text-base
  text-emerald-200
  font-medium
  mt-2
  tracking-wide
">
آسان بکنگ • بہترین کرایے • قابل اعتماد سفر
</p>


              </div>


            </a>



            <div>

              <span className="
                text-xs
                bg-emerald-500/20
                text-emerald-300
                border
                border-emerald-500/30
                px-3.5
                py-1.5
                rounded-full
                font-bold
                uppercase
                tracking-wider
                animate-pulse
              ">
                🟢 Live Booking System Active
              </span>

            </div>


          </div>


        </header>



        {/* Navigation */}

        <nav className="
          bg-white
          border-b
          border-slate-200
          shadow-sm
          sticky
          top-0
          z-40
        ">


          <div className="
            max-w-7xl
            mx-auto
            px-4
            py-2
            flex
            flex-wrap
            justify-center
            items-center
            gap-4
            text-sm
            font-semibold
          ">


            <a 
              href="/"
              className="
              flex
              items-center
              gap-2
              px-3
              py-2
              text-blue-600
              hover:bg-blue-50
              rounded-lg
              transition
              "
            >
              🎟️ نیا بکنگ فارم
            </a>


            <span className="text-slate-200 hidden md:inline">|</span>


            <button
              onClick={() => setActiveModal("seats")}
              className="
              flex
              items-center
              gap-2
              px-3
              py-2
              text-slate-600
              hover:bg-slate-100
              rounded-lg
              transition
              "
            >
              📊 خالی سیٹوں کی رپورٹ
            </button>


            <span className="text-slate-200 hidden md:inline">|</span>


            <button
              onClick={() => setActiveModal("terminals")}
              className="
              flex
              items-center
              gap-2
              px-3
              py-2
              text-slate-600
              hover:bg-slate-100
              rounded-lg
              transition
              "
            >
              🏢 کراچی برانچ نیٹ ورک
            </button>


            <span className="text-slate-200 hidden md:inline">|</span>


            <button
              onClick={() => setActiveModal("support")}
              className="
              flex
              items-center
              gap-2
              px-3
              py-2
              text-slate-600
              hover:bg-slate-100
              rounded-lg
              transition
              "
            >
              📞 ہیڈ آفس ہیلپ لائن
            </button>


          </div>


        </nav>



        <main className="flex-grow">
          {children}
        </main>




        {/* Footer */}

        <footer className="
          bg-slate-900
          text-slate-400
          py-8
          text-center
          text-sm
          border-t
          border-slate-800
          mt-12
        ">


          <p className="
            font-bold
            text-slate-300
          ">
            🚍 Karachi Smart Travel Services (KSTS)
          </p>


          <p className="
            mt-1
            text-xs
            text-slate-500
          ">
            © 2026 Karachi Smart Travel Services. All booking terminals connected.
          </p>


        </footer>



      </body>

    </html>

  );
}
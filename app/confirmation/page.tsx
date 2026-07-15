"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  const [bus, setBus] = useState<any>(null);
  const [search, setSearch] = useState<any>(null);
  const [seats, setSeats] = useState<string[]>([]);
  const [ticketId] = useState(() => `TW-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    const selectedBus = localStorage.getItem("selectedBus");
    const searchDetails = localStorage.getItem("searchDetails");
    const bookedSeats = localStorage.getItem("bookedSeats");

    if (selectedBus) setBus(JSON.parse(selectedBus));
    if (searchDetails) setSearch(JSON.parse(searchDetails));
    if (bookedSeats) setSeats(JSON.parse(bookedSeats));
  }, []);

  if (!bus || !search) return <div className="text-center py-20">Formatting boarding documents...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-2xl font-black">Booking Confirmed!</h2>
          <p className="text-emerald-100 text-sm mt-1">Ready for departure! Check your booking details below.</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center text-sm border-b pb-4">
            <div>
              <p className="text-slate-400 font-semibold">PASS ID</p>
              <p className="font-mono font-bold text-slate-900">{ticketId}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-semibold">PAYMENT STATUS</p>
              <p className="text-emerald-600 font-bold uppercase text-xs bg-emerald-50 px-2.5 py-1 rounded-md">Fully Paid</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Route details</p>
              <p className="text-lg font-bold text-slate-800">{search.from} ➔ {search.to}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Travel Date</p>
              <p className="text-lg font-bold text-slate-800">{search.date}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Carrier Service</p>
              <p className="text-lg font-bold text-slate-800">{bus.company}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Reserved Seats</p>
              <p className="text-lg font-black text-blue-600">{seats.join(", ")}</p>
            </div>
          </div>

          <div className="border-t border-dashed pt-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Grand Total Charged</p>
              <p className="text-3xl font-black text-slate-900">${seats.length * bus.price}</p>
            </div>
            <div className="h-12 w-32 bg-slate-200 rounded flex items-center justify-center font-mono text-[9px] tracking-widest text-slate-500">
              ||||| | |||| ||| ||
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button onClick={() => router.push("/")} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
          Return to Search
        </button>
      </div>
    </div>
  );
}

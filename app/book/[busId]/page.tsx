"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Seat {
  id: string;
  status: "available" | "booked";
}

const INITIAL_SEATS: Seat[] = [
  { id: '1A', status: 'available' }, { id: '1B', status: 'available' }, { id: '1C', status: 'booked' }, { id: '1D', status: 'available' },
  { id: '2A', status: 'available' }, { id: '2B', status: 'available' }, { id: '2C', status: 'available' }, { id: '2D', status: 'booked' },
  { id: '3A', status: 'available' }, { id: '3B', status: 'available' }, { id: '3C', status: 'available' }, { id: '3D', status: 'available' },
  { id: '4A', status: 'booked' },    { id: '4B', status: 'available' }, { id: '4C', status: 'available' }, { id: '4D', status: 'available' },
  { id: '5A', status: 'available' }, { id: '5B', status: 'available' }, { id: '5C', status: 'booked' }, { id: '5D', status: 'available' },
  { id: '6A', status: 'available' }, { id: '6B', status: 'available' }, { id: '6C', status: 'available' }, { id: '6D', status: 'available' },
];

export default function BookSeatsPage() {
  const router = useRouter();
  const [bus, setBus] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [liveLog, setLiveLog] = useState<string | null>(null);

  useEffect(() => {
    const activeBus = localStorage.getItem("selectedBus");
    if (activeBus) setBus(JSON.parse(activeBus));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const availableSeats = seats.filter(s => s.status === 'available' && !selectedSeats.includes(s.id));
      if (availableSeats.length > 0) {
        const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
        
        setSeats(prev => prev.map(s => s.id === randomSeat.id ? { ...s, status: 'booked' } : s));
        setLiveLog(`User in another browser booked Seat ${randomSeat.id}!`);
        setTimeout(() => setLiveLog(null), 3000);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [seats, selectedSeats]);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === 'booked') return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    localStorage.setItem("bookedSeats", JSON.stringify(selectedSeats));
    router.push("/confirmation");
  };

  if (!bus) return <div className="text-center py-20 font-bold">Synchronizing seat charts...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {liveLog && (
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-950 p-4 rounded-r-xl mb-6 shadow-sm animate-pulse flex justify-between items-center">
          <span className="text-sm font-semibold">⚡ {liveLog}</span>
          <span className="text-xs bg-amber-200 px-2 py-0.5 rounded-full font-bold">LIVE UPDATE</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{bus.company} Layout Map</h2>
          <p className="text-sm text-slate-500 mb-6">Real-time availability showing below.</p>

          <div className="border border-slate-200 rounded-2xl py-8 max-w-[280px] mx-auto bg-slate-50">
            <div className="flex justify-end px-8 mb-6">
              <span className="text-2xl border-2 border-slate-300 bg-white p-1 rounded-lg">⚙️</span>
            </div>

            <div className="grid grid-cols-5 gap-3 justify-center px-6">
              {Array.from({ length: 6 }).map((_, rowIndex) => {
                const seatRow = seats.slice(rowIndex * 4, rowIndex * 4 + 4);
                return (
                  <React.Fragment key={rowIndex}>
                    <button onClick={() => handleSeatClick(seatRow[0].id)} className={`h-10 w-10 rounded-lg text-xs font-bold border transition ${seatRow[0].status === "booked" ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed" : selectedSeats.includes(seatRow[0].id) ? "bg-blue-600 border-blue-700 text-white shadow-md" : "bg-green-100 border-green-200 text-green-800 hover:bg-green-200"}`}>
                      {seatRow[0].id}
                    </button>
                    <button onClick={() => handleSeatClick(seatRow[1].id)} className={`h-10 w-10 rounded-lg text-xs font-bold border transition ${seatRow[1].status === "booked" ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed" : selectedSeats.includes(seatRow[1].id) ? "bg-blue-600 border-blue-700 text-white shadow-md" : "bg-green-100 border-green-200 text-green-800 hover:bg-green-200"}`}>
                      {seatRow[1].id}
                    </button>
                    <div className="w-6"></div>
                    <button onClick={() => handleSeatClick(seatRow[2].id)} className={`h-10 w-10 rounded-lg text-xs font-bold border transition ${seatRow[2].status === "booked" ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed" : selectedSeats.includes(seatRow[2].id) ? "bg-blue-600 border-blue-700 text-white shadow-md" : "bg-green-100 border-green-200 text-green-800 hover:bg-green-200"}`}>
                      {seatRow[2].id}
                    </button>
                    <button onClick={() => handleSeatClick(seatRow[3].id)} className={`h-10 w-10 rounded-lg text-xs font-bold border transition ${seatRow[3].status === "booked" ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed" : selectedSeats.includes(seatRow[3].id) ? "bg-blue-600 border-blue-700 text-white shadow-md" : "bg-green-100 border-green-200 text-green-800 hover:bg-green-200"}`}>
                      {seatRow[3].id}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Checkout Details</h3>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Selected Seats:</span>
              <span className="font-bold text-slate-950">{selectedSeats.join(", ") || "None"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Base Price:</span>
              <span className="font-bold">${bus.price} per seat</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-black text-slate-950">
              <span>Grand Total:</span>
              <span>${selectedSeats.length * bus.price}</span>
            </div>
          </div>
          <button onClick={handleConfirm} disabled={selectedSeats.length === 0} className={`w-full py-3.5 rounded-xl font-bold transition ${selectedSeats.length > 0 ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
            Complete Booking
          </button>
        </div>
      </div>
    </div>
  );
}
